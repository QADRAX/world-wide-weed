import { DBUser, toWeedPlayer } from "../db/model/User";
import { WeedPlayer } from "types/WeedPlayer";

export class ConnectionHub {
    private _connectedPlayers: Map<string, DBUser>;

    constructor() {
        this._connectedPlayers = new Map<string, DBUser>();
    }

    get connectedPlayers() {
        return this._connectedPlayers;
    }

    public setPlayer = (
        player: DBUser,
        socketId: string
    ): void => { this._connectedPlayers.set(socketId, player) };

    public deletePlayer = (
        socketId: string
    ): void => { this._connectedPlayers.delete(socketId) };

    public getSocketId = (
        playerId: string,
    ): string | undefined => {
        for (let [key, value] of this._connectedPlayers.entries()) {
            if (value.id === playerId) {
                return key;
            }
        }
        return undefined;
    }

    public currentUsers = (): WeedPlayer[] => {
        const result: WeedPlayer[] = [];
        for (let value of this._connectedPlayers.values()) {
            result.push(toWeedPlayer(value));
        }
        return result;
    }
}

