import { getUserByToken } from '../auth/jwt';
import * as socketio from 'socket.io';
import { SendChatMessagePayload, SOCKET_ACTIONS } from '../../types/SocketMessages';
import { EmitAction } from './EmitActions';
import { AppConnectionHub } from './GameState';

export const handleSocketIOConnections = (io: socketio.Server) => {
    io.on('connection', (socket: socketio.Socket) => {
        (async () => {
            const socketId = socket.id;
            const token = socket.handshake.auth.token;
            const user = await getUserByToken(token);
        
            if(user) {

                AppConnectionHub.setPlayer(user, socketId);
                EmitAction.updateUsers(io)();

                console.log(`Player ${user.name} connected`);
                
                socket.on(SOCKET_ACTIONS.SEND_CHAT_MESSAGE, (payload: SendChatMessagePayload) => {
                    console.log(`new message from ${user.name}: '${payload.message}' in room: ${payload.roomId}`);
                    EmitAction.sendChatResponse(io)(user, payload);
                });
        
                socket.on('disconnect', () => {
                    AppConnectionHub.deletePlayer(socketId);
                    EmitAction.updateUsers(io)();
                    console.log(`Player ${user.name} disconnected`);
                });
            }
        })();
    });
}

