import * as socketio from 'socket.io';
import { DBUser } from "server/db/model/User";

export type SocketConnections = {
    [socketId: string]: {
        player: DBUser;
        socket: socketio.Socket;
    }
};

export const connections: SocketConnections = {};
