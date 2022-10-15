import { ResponseChatMessagePayload, SendChatMessagePayload, SOCKET_ACTIONS } from "../../types/SocketMessages";
import * as socketio from 'socket.io';
import { DBUser, toWeedPlayer } from "../db/model/User";
import { AppConnectionHub } from "./GameState";

const updateUsers = (io: socketio.Server) =>
    () => io.emit(SOCKET_ACTIONS.UPDATE_USERS, AppConnectionHub.currentUsers());

const sendChatResponse = (io: socketio.Server) =>
    (user: DBUser, payload: SendChatMessagePayload) => {
        const response: ResponseChatMessagePayload = {
            chatMessage: {
                text: payload.message,
                sender: toWeedPlayer(user),
                date: Date.now(),
            },
            roomId: payload.roomId,
        };
        io.emit(SOCKET_ACTIONS.RESPONSE_CHAT_MESSAGE, response);
    };

export const EmitAction = {
    updateUsers,
    sendChatResponse,
};