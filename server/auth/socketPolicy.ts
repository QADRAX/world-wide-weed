import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
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
            console.log('Authorized conexion');
        } else {
            next(new Error('unauthorized'));
            console.log('unauthorized conexion')
        }
    } catch {
        next(new Error('unauthorized conexion Invalid JWT'));
        console.log('unauthorized conexion Invalid JWT');
    }
}