import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { Log } from "../../utils/console";
import { getUserByToken } from "./jwt";

/**
 * middleware for websocket connections. Here connections are rejected given their JWT token. 
 * @param socket 
 * @param next 
 */
export const authSocketPolicy = async (
    socket: Socket, 
    next: (err?: ExtendedError) => void,
) => {
    const token = socket.handshake.auth.token;
    try{
        const user = await getUserByToken(token);
        if (user) {
            next();
            Log('Authorized conexion', 'info');
        } else {
            next(new Error('unauthorized'));
            Log('unauthorized conexion', 'critical')
        }
    } catch {
        next(new Error('unauthorized conexion Invalid JWT'));
        Log('unauthorized conexion Invalid JWT', 'critical');
    }
}