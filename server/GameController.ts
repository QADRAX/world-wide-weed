import { CreateRoomRequest } from "../pages/api/rooms/create";
import { JoinRoomRequest as JoinRoomRequest } from "../pages/api/rooms/join";
import { MIN_PLAYERS_IN_MATCH } from "../shared/constants";
import { UserInfo } from "../types/UserInfo";
import { ValidationResult } from "../types/ValidationResult";
import { WeedError } from "../types/weed/MatchErrors";
import { CardRequest, WeedMatch, WeedRoom } from "../types/weed/WeedTypes";
import { WeedMatchValidator } from "./game/WeedMatchValidator";
import { IGameController } from "./GameController.interface";
import { MatchRepository } from "./repository/matchRepository";
import { RoomRepository } from "./repository/roomRepository";

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
                await RoomRepository.joinToRoom(this.userInfo, request.roomId);
                result.result = targetRoom;
            }
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
            const isReady = currentRoom.readyPlayersIds[this.userInfo.id] != null;
            if (!isReady) {
                await RoomRepository.setReadyToMatch(this.userInfo, currentRoom.id);
                result.result = currentRoom;

                // Auto start match
                const room = await RoomRepository.getPlayerRoom(this.userInfo.id);
                if (room) {
                    const playersReady = Object.keys(room.readyPlayersIds);
                    const allPlayersReady = room.players.length == playersReady.length;
                    if (allPlayersReady && playersReady.length > MIN_PLAYERS_IN_MATCH) {
                        this.startMatch(room);
                    }
                } else {
                    result.errors.push('PlayerNotInAnyRoom');
                }

            } else {
                result.errors.push('PlayerAlreadyReady');
            }
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
                    const matchValidator = new WeedMatchValidator(match.privateMatchSnapshots);
                    const validatedPlay = matchValidator.validatePlayCard(request);
                    if(validatedPlay.result) {
                        await MatchRepository.addPrivateSnapshotToMatch(match, validatedPlay.result);
                        result.result = match;

                        // Auto game over
                        this.finishMatch(currentRoom, match);

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

    private async startMatch(room: WeedRoom) {
        const match = await MatchRepository.createMatch(room);
        await RoomRepository.setMatchId(match.id, room.id);
        await RoomRepository.setIsMatchStarted(room.id, true);
    }

    private async finishMatch(room: WeedRoom, match: WeedMatch) {
        await RoomRepository.clearReadyPlayers(room.id);
        await RoomRepository.deletePlayers(room.id);
        await RoomRepository.setIsMatchStarted(room.id, false);
        await MatchRepository.deleteMatch(match.id);
    }
}