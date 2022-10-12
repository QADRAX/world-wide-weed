import { getUserByToken } from '../auth/jwt';
import * as socketio from 'socket.io';
import { connections, SocketConnections } from './state';
import { ResponseChatMessagePayload, SendMessagePayload, SOCKET_ACTIONS } from '../../types/SocketActions';
import { toWeedPlayer } from '../db/model/User';
import { WeedPlayer } from 'types/WeedPlayer';

const currentUsers = (socketConnections: SocketConnections): WeedPlayer[] => {
    const values = Object.values(socketConnections);
    const players = values.map((value) => toWeedPlayer(value.player));
    return players;
}

export const handleSocketIOConnections = (io: socketio.Server) => {
    io.on('connection', (socket: socketio.Socket) => {
        (async () => {
            const socketId = socket.id;
            const token = socket.handshake.auth.token;
            const user = await getUserByToken(token);
        
            if(user) {
                connections[socketId] = {
                    player: user,
                    socket,
                };
                io.emit(SOCKET_ACTIONS.UPDATE_USERS, currentUsers(connections))
                console.log(`Player ${user.name} connected`);
                
                socket.on(SOCKET_ACTIONS.SEND_CHAT_MESSAGE, (payload: SendMessagePayload) => {
                    const response: ResponseChatMessagePayload = {
                        chatMessage: {
                            text: payload.message,
                            sender: toWeedPlayer(user),
                            date: Date.now(),
                        },
                        roomId: payload.roomId,
                    };
                    console.log(`new message from ${user.name}: '${payload.message}' in room: ${payload.roomId}`);
                    io.emit(SOCKET_ACTIONS.RESPONSE_CHAT_MESSAGE, response)
                });
        
                socket.on('disconnect', () => {
                    delete connections[socket.id];
                    io.emit(SOCKET_ACTIONS.UPDATE_USERS, currentUsers(connections))
                    console.log(`Player ${user.name} disconnected`);
                });
            }
        })();
    });
}

