import { WeedPlayer } from "../types/Player";
import { OngoingWeedMatch, WeedMatch } from "../types/weed/WeedTypes";
import { firebaseAdmin } from "./firebaseAdmin";
import { v4 } from 'uuid';

export async function createWeedMatch(
    player: WeedPlayer
): Promise<string> {
    const matchId = v4();
    const newMatch: WeedMatch = {
        players: [player],
        publicMatchSnapshots: [],
        privateMatchSnapshots: [],
        protectedMatchSnapshots: {
            [player.id]: [],
        },
    };

    const database = firebaseAdmin.database();
    await database.ref(`matches/${matchId}`).set(newMatch);

    const currentMatch: OngoingWeedMatch = {
        id: matchId,
        creator: player,
        players: [player],
        isStarted: false,
    };
    await database.ref(`ongoingMatches/${matchId}`).set(currentMatch);

    return matchId;
}