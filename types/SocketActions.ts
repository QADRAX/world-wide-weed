import { ChatMessage } from "./ChatMessage";

export const SOCKET_ACTIONS = {
    SEND_CHAT_MESSAGE: 'SendChatMessage',
    RESPONSE_CHAT_MESSAGE: 'ResponseChatMessage',
    UPDATE_USERS: 'updateUsers',
    START_MATCH_MAKING: 'startMatchMaking',
    NEW_MATCH_MAKING: 'newMatchMaking',
};

export type SendChatMessagePayload = {
    message: string;
    roomId: string;
};

export type ResponseChatMessagePayload = {
    chatMessage: ChatMessage;
    roomId: string;
};

export type StartMatchMakingPayload = {};
