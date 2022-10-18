import { WeedPlayer } from "../types/Player";
import { MatchesDict, OngoingWeedMatch, WeedMatch } from "../types/weed/WeedTypes";
import { firebaseAdmin } from "./firebaseAdmin";
import { v4 } from 'uuid';

export async function createMatch(
    player: WeedPlayer,
    matchName: string,
): Promise<OngoingWeedMatch> {
    const matchId = v4();
    const newMatch: WeedMatch = {
        id: matchId,
        name: matchName,
        players: [player],
        publicMatchSnapshots: [],
        privateMatchSnapshots: [],
        protectedMatchSnapshots: {
            [player.id]: [],
        },
    };

    const database = firebaseAdmin.database();
    await database.ref(`matches/${matchId}`).set(newMatch);

    const ongoingMatch: OngoingWeedMatch = {
        id: matchId,
        name: matchName,
        creator: player,
        onGoingPlayer: [{
            player: player,
            isReady: false,
        }],
        isStarted: false,
    };
    await database.ref(`ongoingMatches/${matchId}`).set(ongoingMatch);

    return ongoingMatch;
}

export async function getPlayerMatch(
    playerId: string
): Promise<OngoingWeedMatch | undefined> {
    const database = firebaseAdmin.database();
    const matchesRef = database.ref('/ongoingMatches');
    const snap = await matchesRef.once('value');
    const ongoingMatchesDict = snap.val() as MatchesDict | undefined;
    const ongoingMatches = Object.values(ongoingMatchesDict ?? {});
    const playerMatch = ongoingMatches
        .find((m) => m.onGoingPlayer.find(((p) => p.player.id == playerId)) != null);
    return playerMatch;
}