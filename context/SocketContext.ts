import React from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';

export const getSocket = (token: string): any => {
    const socket = io({
        auth: {
            token,
        }
    });
    return socket;
};

export type SocketContextState = {
    socket?: Socket;
}

export const SocketContext = React.createContext<SocketContextState>({});
