import { Player } from "server/types/Player";

export class ConnectionHub<P extends Player> {
    private _connectedPlayers: Map<string, P>;

    constructor() {
        this._connectedPlayers = new Map<string, P>();
    }

    get connectedPlayers() {
        return this._connectedPlayers;
    }

    public setPlayer = (
        player: P,
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

    public currentUsers = (): P[] => {
        const result: P[] = [];
        for (let value of this._connectedPlayers.values()) {
            result.push(value);
        }
        return result;
    }
}

