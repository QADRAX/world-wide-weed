import { getUserByToken } from '../auth/jwt';
import * as socketio from 'socket.io';
import { currentUsers, deletePlayer, setPlayer } from './state';
import { ResponseChatMessagePayload, SendChatMessagePayload, SOCKET_ACTIONS } from '../../types/SocketActions';
import { toWeedPlayer } from '../db/model/User';

export const handleSocketIOConnections = (io: socketio.Server) => {

    // Send actions

    const updateUsers = () => io.emit(SOCKET_ACTIONS.UPDATE_USERS, currentUsers());

    // On  new Connection

    io.on('connection', (socket: socketio.Socket) => {
        (async () => {
            const socketId = socket.id;
            const token = socket.handshake.auth.token;
            const user = await getUserByToken(token);
        
            if(user) {
                setPlayer(user, socketId);
                updateUsers();

                console.log(`Player ${user.name} connected`);
                
                socket.on(SOCKET_ACTIONS.SEND_CHAT_MESSAGE, (payload: SendChatMessagePayload) => {
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
                    deletePlayer(socketId);
                    updateUsers();
                    console.log(`Player ${user.name} disconnected`);
                });
            }
        })();
    });
}

