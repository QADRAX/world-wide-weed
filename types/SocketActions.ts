import { ChatMessage } from "./ChatMessage";

export const SOCKET_ACTIONS = {
    SEND_CHAT_MESSAGE: 'SendChatMessage',
    RESPONSE_CHAT_MESSAGE: 'ResponseChatMessage',
    UPDATE_USERS: 'updateUsers',
};

export type SendMessagePayload = {
    message: string;
    roomId: string;
};

export type ResponseChatMessagePayload = {
    chatMessage: ChatMessage;
    roomId: string;
}
