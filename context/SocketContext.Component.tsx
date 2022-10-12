import React, { FunctionComponent } from "react";
import { getSocket, SocketContext } from "./SocketContext";

export type SocketContextProps = {
    token: string;
    children?: React.ReactNode;
}

export const SocketContextComponent: FunctionComponent<SocketContextProps> = (props) => {
    return (
        <SocketContext.Provider value={{ socket: getSocket(props.token) }}>
            {props.children}
        </SocketContext.Provider>
    )
};