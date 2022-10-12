import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { WeedPlayer } from "types/WeedPlayer";
import { AppContext, SocketActions } from "./AppContext";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import { SocketContext } from "./SocketContext";
import { ResponseChatMessagePayload, SendMessagePayload, SOCKET_ACTIONS } from "types/SocketActions";
import { useAppDispatch } from "hooks/redux";
import { addMessage, setPlayers } from "redux/chatRoom/chatRoomSlice";

export type AppContextProps = {
    token: string;
    player: WeedPlayer;
    children?: React.ReactNode;
}

export const AppContextComponent: FunctionComponent<AppContextProps> = (props) => {
    const { socket } = useContext(SocketContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const router = useRouter();

    const logOut = () => {
        deleteCookie("token");
        router.replace("/");
        console.log('Manual logout');
    };

    // socket actions

    const sendChatMessage = (payload: SendMessagePayload) => {
        if(socket){
            console.log(`Sending message: ${payload.message}`)
            socket.emit(SOCKET_ACTIONS.SEND_CHAT_MESSAGE, payload);
        }
    }

    const socketActions: SocketActions = {
        sendChatMessage,
    }

    useEffect(() => {
        if (socket) {
            const anySocket = socket as any;
            const engine = anySocket.io.engine;

            socket.on('connect', () => {
                console.log('Connected');
                setIsLoading(false);
                setIsError(false);
            });

            engine.on("close", (reasson: string) => {
                console.log('Connection closed: ', reasson);
                setIsLoading(false);
                setIsError(true);
            });

            socket.on(SOCKET_ACTIONS.RESPONSE_CHAT_MESSAGE, (response: ResponseChatMessagePayload) => {
                dispatch(addMessage(response));
            });

            socket.on(SOCKET_ACTIONS.UPDATE_USERS, (response: WeedPlayer[]) => {
                dispatch(setPlayers(response))
            });
        }

        return () => {
            if (socket) { 
                socket.disconnect();
            }
        }
    }, [socket]);

    return (
        <AppContext.Provider value={{
            token: props.token,
            player: props.player,
            isLoadingConnection: isLoading,
            isConnectionError: isError,
            logOut,
            actions: socketActions
        }} >
            {props.children}
        </AppContext.Provider>
    )
};