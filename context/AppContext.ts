import { createContext } from "react";
import { SendChatMessagePayload } from "types/SocketActions";
import { WeedPlayer } from "types/WeedPlayer";

export type AppContext = {
    token?: string;
    player?: WeedPlayer;
    isLoadingConnection: boolean,
    isConnectionError: boolean,
    logOut: () => void;
    actions: SocketActions,
};

export type SocketActions = {
    sendChatMessage: (payload: SendChatMessagePayload) => void; 
}

export const AppContext = createContext<AppContext>({ 
    isLoadingConnection: true, 
    isConnectionError: false,
    logOut: () => {},
    actions: {
        sendChatMessage: () => {},
    }
});
