import { DBUser } from "server/db/model/User";

export type SocketConnections = {
    [socketId: string]: {
        player: DBUser;
    }
};

export const connections: SocketConnections = {};
