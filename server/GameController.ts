import { CreateRoomRequest } from "../pages/api/rooms/create";
import { DeleteRoomRequest } from "../pages/api/rooms/delete";
import { JoinRoomRequest as JoinRoomRequest } from "../pages/api/rooms/join";
import { MIN_PLAYERS_IN_MATCH } from "../shared/constants";
import { UserInfo } from "../types/UserInfo";
import { ValidationResult } from "../types/ValidationResult";
import { WeedError } from "../types/MatchErrors";
import { CardRequest, WeedMatch, WeedRoom } from "../types/WeedTypes";
import { toArray } from "../utils/Dict";
import { Log } from "../utils/Log";
import { WeedMatchValidator } from "./game/WeedMatchValidator";
import { IGameController } from "./GameController.interface";
import { MatchRepository } from "./repository/matchRepository";
import { RoomRepository } from "./repository/roomRepository";
import { ChatMessage } from "../types/ChatMessage";
import { toWeedPlayer } from "../shared/mappers";

export class GameController implements IGameController {
    private userInfo: UserInfo;

    constructor(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }

    async createRoom(request: CreateRoomRequest): Promise<ValidationResult<WeedError, WeedRoom>> {
        const result: ValidationResult<WeedError, WeedRoom> = {
            result: undefined,
            errors: [],
        };

        const currentRooms = await RoomRepository.getWeedRooms();
        const sameNameRoom = currentRooms.find((room) => room.name == request.roomName);
        if (sameNameRoom) {
            result.errors.push('SameRoomName');
        } else {
            const room = await RoomRepository.createRoom(request.roomName);
            result.result = room;
        }

        return result;
    }

    async deleteRoom(request: DeleteRoomRequest): Promise<ValidationResult<WeedError, boolean>> {
        const result: ValidationResult<WeedError, boolean> = {
            result: undefined,
            errors: [],
        };
        const room = await RoomRepository.getWeedRoom(request.roomId);
        if (room) {
            if (room.matchId) {
                await MatchRepository.deleteMatch(room.matchId);
            }
            await RoomRepository.deleteRoom(request.roomId);
            await RoomRepository.deleteRoomChat(request.roomId);
            result.result = true;
        } else {
            result.errors.push('RoomNotExists');
        }

        return result;
    }

    async joinRoom(request: JoinRoomRequest): Promise<ValidationResult<WeedError, WeedRoom>> {
        const result: ValidationResult<WeedError, WeedRoom> = {
            result: undefined,
            errors: [],
        };

        const currentRoom = await RoomRepository.getPlayerRoom(this.userInfo.id);
        if (currentRoom) {
            result.errors.push('PlayerAlreadyInRoom');
        } else {
            const targetRoom = await RoomRepository.getWeedRoom(request.roomId);
            if (!targetRoom) {
                result.errors.push('RoomNotExists');
            } else {
                const isAlreadyStarted = targetRoom.matchId != null;
                if (isAlreadyStarted) {
                    result.errors.push('RoomAlreadyStarted');
                } else {
                    await RoomRepository.joinToRoom(this.userInfo, request.roomId);
                    result.result = targetRoom;
                }
            }
        }

        return result;
    }

    async leaveRoom(): Promise<ValidationResult<WeedError, WeedRoom>> {
        const result: ValidationResult<WeedError, WeedRoom> = {
            result: undefined,
            errors: [],
        };

        const currentRoom = await RoomRepository.getPlayerRoom(this.userInfo.id);
        if (currentRoom) {
            const readyPlayersIdsDict = currentRoom.readyPlayersIds ?? {};
            const readyPlayersIds = toArray(readyPlayersIdsDict);
            const isPlayerReady = readyPlayersIds.includes(this.userInfo.id);
            const isMatchOngoing = currentRoom.matchId != null;

            if (!isMatchOngoing) {
                if (!isPlayerReady) {
                    await RoomRepository.leaveRoom(this.userInfo, currentRoom.id);
                    result.result = currentRoom;
                } else {
                    result.errors.push('CannotLeaveRoomIfPlayerReady');
                }
            } else {
                result.errors.push('CannotLeaveRoomDuringMatch');
            }
        } else {
            result.errors.push('PlayerNotInAnyRoom');
        }

        return result;
    }

    async undoReadyToMatch(): Promise<ValidationResult<WeedError, WeedRoom>> {
        const result: ValidationResult<WeedError, WeedRoom> = {
            result: undefined,
            errors: [],
        };

        const currentRoom = await RoomRepository.getPlayerRoom(this.userInfo.id);
        if (currentRoom) {
            const readyPlayersIdsDict = currentRoom.readyPlayersIds ?? {};
            const readyPlayersIds = toArray(readyPlayersIdsDict);
            const isPlayerReady = readyPlayersIds.includes(this.userInfo.id);
            const isMatchOngoing = currentRoom.matchId != null;
            if (!isMatchOngoing) {
                if (isPlayerReady) {
                    await RoomRepository.undoReadyToMatch(this.userInfo, currentRoom.id);
                    result.result = currentRoom;
                } else {
                    result.errors.push('PlayerNotReady');
                }
            } else {
                result.errors.push('CannotUndoReadyDuringMatch');
            }
        } else {
            result.errors.push('PlayerNotInAnyRoom');
        }

        return result;
    }

    async readyToMatch(): Promise<ValidationResult<WeedError, WeedRoom>> {
        const result: ValidationResult<WeedError, WeedRoom> = {
            result: undefined,
            errors: [],
        };

        const currentRoom = await RoomRepository.getPlayerRoom(this.userInfo.id);
        if (currentRoom) {
            const readyPlayersIds = currentRoom.readyPlayersIds ?? {};
            const isReady = readyPlayersIds[this.userInfo.id] != null;
            if (!isReady) {
                await RoomRepository.setReadyToMatch(this.userInfo, currentRoom.id);
                result.result = currentRoom;

                // Auto start match
                await this.autoStartMatch();

            } else {
                result.errors.push('PlayerAlreadyReady');
            }
        } else {
            result.errors.push('PlayerNotInAnyRoom');
        }

        return result;
    }

    public async postChatMessage(message: string): Promise<ValidationResult<WeedError, boolean>> {
        const result: ValidationResult<WeedError, boolean> = {
            result: undefined,
            errors: [],
        };

        const currentRoom = await RoomRepository.getPlayerRoom(this.userInfo.id);
        if (currentRoom) {
            const chatMessage: ChatMessage = {
                text: message,
                date: new Date().getTime(),
                sender: toWeedPlayer(this.userInfo),
            };
            await RoomRepository.postChatMessage(currentRoom.id, chatMessage);
            result.result = true;
        } else {
            result.errors.push('PlayerNotInAnyRoom');
        }

        return result;
    }

    public async playCard(request: CardRequest): Promise<ValidationResult<WeedError, WeedMatch>> {
        const result: ValidationResult<WeedError, WeedMatch> = {
            result: undefined,
            errors: [],
        };

        const currentRoom = await RoomRepository.getPlayerRoom(this.userInfo.id);
        if (currentRoom) {
            if (currentRoom.matchId) {
                const match = await MatchRepository.getMatch(currentRoom.matchId);
                if (match) {
                    const matchValidator = new WeedMatchValidator(match.privateMatchSnapshots, match.players);
                    const validatedPlay = matchValidator.validatePlayCard(request);
                    if (validatedPlay.result) {
                        const nextMatch = await MatchRepository.addPrivateSnapshotToMatch(match, validatedPlay.result, request);
                        result.result = match;

                        // Auto game over
                        const nextValidator = new WeedMatchValidator(nextMatch.privateMatchSnapshots, nextMatch.players);
                        if (nextValidator.gameOver) {
                            await this.finishMatch(currentRoom, match);
                        }

                    } else {
                        result.errors = [...result.errors, ...validatedPlay.errors];
                    }
                } else {
                    result.errors.push('MatchNotExists');
                }
            } else {
                result.errors.push('TargetPlayerNotInMatch');
            }
        } else {
            result.errors.push('PlayerNotInAnyRoom');
        }

        return result;
    }

    private async autoStartMatch(): Promise<void> {
        const room = await RoomRepository.getPlayerRoom(this.userInfo.id);
        if (room) {
            const readyPlayersIds = room.readyPlayersIds ?? {};
            const playersReady = toArray(readyPlayersIds);
            const roomPlayers = toArray(room.players);
            const isAllPlayersReady = roomPlayers.length == playersReady.length;
            Log(`isAllPlayersReady: ${isAllPlayersReady}`);
            if (isAllPlayersReady && playersReady.length >= MIN_PLAYERS_IN_MATCH) {
                Log('All players ready, starting match', 'info');
                await this.startMatch(room);
            }
        } else {
            Log('Start match failed, room disapear... This shold not happen', 'critical');
        }
    }

    private async startMatch(room: WeedRoom) {
        const match = await MatchRepository.createMatch(room);
        await RoomRepository.setMatchId(room.id, match.id);
    }

    private async finishMatch(room: WeedRoom, match: WeedMatch) {
        await RoomRepository.clearReadyPlayers(room.id);
        await RoomRepository.deletePlayers(room.id);
        await RoomRepository.setMatchId(room.id, '');
        await RoomRepository.deleteRoomChat(room.id);
        await MatchRepository.deleteMatch(match.id);
    }
}