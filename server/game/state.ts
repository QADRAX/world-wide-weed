import { DBUser, toWeedPlayer } from "../db/model/User";
import { WeedMatch } from "types/weed/WeedTypes";
import { WeedPlayer } from "types/WeedPlayer";

export type SocketConnections = {
    [socketId: string]: DBUser;
};

export type WeedMatches = {
    [matchId: string]: WeedMatch;
}

export const connections: SocketConnections = {};
export const matches: WeedMatches = {};

export const setPlayer = (player: DBUser, socketId: string) => connections[socketId] = player;
export const deletePlayer = (socketId: string) => delete connections[socketId];

export const setMatch = (match: WeedMatch, matchId: string) => matches[matchId] = match;
export const deleteMatch = (matchId: string) => delete matches[matchId];

// Getters

export const currentUsers = (): WeedPlayer[] => {
    const values = Object.values(connections);
    const players = values.map((value) => toWeedPlayer(value));
    return players;
}