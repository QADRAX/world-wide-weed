import { WeedRoom } from "../types/WeedTypes";
import { toArray } from "../utils/Dict";
import { MAX_PLAYERS_IN_MATCH, MIN_PLAYERS_IN_MATCH } from "./constants";

export function getRoomStatusText(room: WeedRoom): string {
    const players = toArray(room.players);
    const numberOfPlayers = players.length;

    const isStarted = room.matchId != null;

    const roomState = numberOfPlayers < MIN_PLAYERS_IN_MATCH
        ? numberOfPlayers === 0
            ? "Empty room"
            : "Waiting for players"
        : isStarted
            ? "Game in progress"
            : numberOfPlayers == MAX_PLAYERS_IN_MATCH
                ? "Full room"
                : "Ready to start";

    return roomState;
}