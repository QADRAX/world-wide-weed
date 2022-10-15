
import { getUserByToken } from '../auth/jwt';
import { toWeedPlayer } from '../db/model/User';
import * as socketio from 'socket.io';
import { ClientSidePlayer, ResponseChatMessagePayload, ResponseUpdateMatch, SendChatMessagePayload, SOCKET_ACTIONS } from '../types/SocketMessages';
import { WeedPlayer } from '../types/Player';
import { ConnectionHub } from './connectionHub/ConnectionHub';
import { MATCH_MAKING_INTERVAL, MAX_PLAYERS_IN_MATCH, MIN_PLAYERS_IN_MATCH } from './GameConstants';
import { toClientSideMatch } from './GameManager.Mappers';
import { MatchHub } from './MatchHub/MatchHub';
import { FifoMatchmaker } from './matchMaker/FifoMachMaker';
import { Matchmaker, ResolverCallback } from './matchMaker/MatchMaker';
import { WeedMatch } from './weedMatch/WeedMatch';
import { Log } from '../utils/console';
import clc from 'cli-color';

export class GameManager {
    private io: socketio.Server;
    private connectionHub: ConnectionHub<WeedPlayer>;
    private matchMaker: Matchmaker<WeedPlayer>;
    private matchHub: MatchHub<WeedPlayer>;

    constructor(io: socketio.Server) {
        this.io = io;

        this.connectionHub = new ConnectionHub<WeedPlayer>();
        this.matchMaker = new FifoMatchmaker<WeedPlayer>({
            checkInterval: MATCH_MAKING_INTERVAL,
            maxMatchSize: MAX_PLAYERS_IN_MATCH,
            minMatchSize: MIN_PLAYERS_IN_MATCH,
        });

        this.matchHub = new MatchHub<WeedPlayer>();

        this.matchMaker.setResolver(this.onMatchMakerResolve);
    }

    handleConnections = () => {
        this.io.on('connection', (socket: socketio.Socket) => {
            (async () => {
                const socketId = socket.id;
                const token = socket.handshake.auth.token;
                const user = await getUserByToken(token);

                if (user) {
                    const player = toWeedPlayer(user);
                    this.connectionHub.setPlayer(player, socketId);
                    this.emitUpdatedUsers();

                    Log(`Player ${clc.underline(player.email)} connected`, 'app');

                    socket.on(SOCKET_ACTIONS.SEND_CHAT_MESSAGE, (payload: SendChatMessagePayload) => {
                        Log(`New message from ${clc.underline(player.email)}: '${payload.message}' in room: ${payload.roomId}`, 'app');
                        this.emitChatResponse(player, payload);
                    });

                    socket.on(SOCKET_ACTIONS.NEW_MATCH_MAKING, () => {
                        const currentMatch = this.matchHub.findPlayerMatch(player);
                        if (!currentMatch) {
                            Log(`Player ${clc.underline(player.email)} added to match maker queue`, 'app');
                            this.matchMaker.push(player);
                            this.emitUpdatedUsers();
                        }
                    });

                    socket.on('disconnect', () => {
                        this.connectionHub.deletePlayer(socketId);
                        this.emitUpdatedUsers();
                        Log(`Player ${clc.underline(player.email)} disconnected`, 'app');
                    });
                }
            })();
        });
    }

    private onMatchMakerResolve: ResolverCallback<WeedPlayer> = (players: WeedPlayer[]) => {
        const match = this.matchHub.createStandarMatch(players);
        if(match) {
            Log(`New match was created with players: ${players.map(p => clc.underline(p.email)).join(' ')}`, 'app');
            this.emitUpdatedMatch(match);
            this.emitUpdatedUsers();
        }
    }

    private emitUpdatedMatch = (weedMatch: WeedMatch<WeedPlayer>) => {
        const matchPlayers = weedMatch.players;
        const clientSideMap = toClientSideMatch(weedMatch);
        matchPlayers.forEach((mp) => {
            const playerId = mp.player.id;
            const socketId = this.connectionHub.getSocketId(playerId);
            if(socketId) {
                const response: ResponseUpdateMatch<WeedPlayer> = {
                    match: clientSideMap,
                    playersHand: mp.hand,
                }
                this.io.to(socketId).emit(SOCKET_ACTIONS.UPDATE_MATCH, response);
            }
        })
        
    }

    private emitUpdatedUsers = () => {
        const currentUsers = this.connectionHub.currentUsers();

        const clientSideUsers = currentUsers.map((u) => this.toClientSidePlayer(u));

        this.io.emit(SOCKET_ACTIONS.UPDATE_USERS, clientSideUsers);
    }

    private emitChatResponse = (user: WeedPlayer, payload: SendChatMessagePayload) => {
        const response: ResponseChatMessagePayload = {
            chatMessage: {
                text: payload.message,
                sender: user,
                date: Date.now(),
            },
            roomId: payload.roomId,
        };
        this.io.emit(SOCKET_ACTIONS.RESPONSE_CHAT_MESSAGE, response);
    };

    private toClientSidePlayer = (player: WeedPlayer): ClientSidePlayer<WeedPlayer> => {
        const playerMatch = this.matchHub.findPlayerMatch(player);
        const isInQueue = this.matchMaker.getPlayerState(player) == 'inqueue';
        const queuePosition = this.matchMaker.indexOnQueue(player);

        const result: ClientSidePlayer<WeedPlayer> = {
            player,
            isInMatch: playerMatch != null,
            isInQueue,
            queuePosition: queuePosition >= 0 ? queuePosition : undefined,
        }
        return result;
    }


}