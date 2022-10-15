import { ChatMessage } from "./ChatMessage";
import { CardRequest, ClientSideMatchSnapShot, WeedCard } from "./weed/WeedTypes";

export const SOCKET_ACTIONS = {
    SEND_CHAT_MESSAGE: 'SendChatMessage',
    RESPONSE_CHAT_MESSAGE: 'ResponseChatMessage',
    UPDATE_USERS: 'updateUsers',
    START_MATCH_MAKING: 'startMatchMaking',
    NEW_MATCH_MAKING: 'newMatchMaking',
    UPDATE_MATCH: 'updateMatch'
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

export type ResponseUpdateMatch<P> = {
    match: ClientSideMatch<P>;
    playersHand: WeedCard[];
};

export type ClientSideMatch<P> = {
    history: ClientSideMatchSnapShot<P>[];
    requestHistory: CardRequest[];
}

export type ClientSidePlayer<P> = {
    player: P;
    isInMatch: boolean;
    isInQueue: boolean;
    queuePosition: number | undefined;
}