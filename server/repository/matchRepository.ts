import { PrivateMatchSnapshot, ProtectedMatchSnapshot, PublicMatchPlayer, PublicMatchSnapshot, WeedMatch, WeedRoom } from "../../types/WeedTypes";
import { firebaseAdmin } from "../firebaseAdmin";
import { v4 } from 'uuid';
import { getInitialMatchSnapshot } from "../game/initialGame";
import { Dict, toArray } from "../../utils/Dict";

export namespace MatchRepository {

    export async function createMatch(
        room: WeedRoom,
    ): Promise<WeedMatch> {
        const database = firebaseAdmin.database();
        let protectedMatchSnapshots: Dict<ProtectedMatchSnapshot[]> = {};

        const players = toArray(room.players);

        players.forEach((p) => {
            protectedMatchSnapshots[p.id] = [];
        });

        const matchId = v4();
        let newMatch: WeedMatch = {
            id: matchId,
            players: players,
            publicMatchSnapshots: [],
            privateMatchSnapshots: [],
            protectedMatchSnapshots: {},
        };

        const initialPrivateSnapshot = getInitialMatchSnapshot(players);

        newMatch = addPrivateSnapshot(newMatch, initialPrivateSnapshot);

        await database.ref(`matches/${matchId}`).set(newMatch);
        return newMatch;
    }

    export async function getMatch(
        matchId: string
    ): Promise<WeedMatch | undefined> {
        const database = firebaseAdmin.database();
        const snap = await database.ref(`/matches/${matchId}`).once('value');
        const match = snap.val() as WeedMatch | undefined;
        return match;
    }

    export async function addPrivateSnapshotToMatch(
        match: WeedMatch,
        privateMatchSnapshot: PrivateMatchSnapshot,
    ): Promise<WeedMatch> {
        const database = firebaseAdmin.database();
        const newMatch = addPrivateSnapshot(match, privateMatchSnapshot);
        await database.ref(`matches/${match.id}`).set(newMatch);
        return newMatch;
    }

    export async function deleteMatch(
        matchId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        await database.ref(`matches/${matchId}`).remove();
    }
}

function addPrivateSnapshot(
    match: WeedMatch,
    privateSnapshot: PrivateMatchSnapshot
): WeedMatch {
    if (match.privateMatchSnapshots == null) {
        match.privateMatchSnapshots = [];
    }
    match.privateMatchSnapshots.push(privateSnapshot);

    const publicMatchPlayers: PublicMatchPlayer[] = privateSnapshot.players.map((p) => {
        const publicMatchPlayer: PublicMatchPlayer = {
            handSize: p.hand.length,
            player: p.player,
            smokedScore: p.smokedScore,
            fields: p.fields,
        };
        return publicMatchPlayer;
    });

    const nextPublicMatchSnapshot: PublicMatchSnapshot = {
        players: publicMatchPlayers,
        deckSize: privateSnapshot.deck.length,
        discards: privateSnapshot.discards,
    };

    if (match.publicMatchSnapshots == null) {
        match.publicMatchSnapshots = [];
    }
    match.publicMatchSnapshots.push(nextPublicMatchSnapshot);


    let protectedMatchSnapshots = match.protectedMatchSnapshots;
    if (protectedMatchSnapshots) {
        protectedMatchSnapshots = {};
    }
    privateSnapshot.players.forEach((p) => {
        const protectedSnapshot: ProtectedMatchSnapshot = {
            hand: p.hand,
        };
        if (protectedMatchSnapshots) {
            let protectedSnapshots = protectedMatchSnapshots[p.player.id];
            if (!protectedSnapshots) {
                protectedSnapshots = [];
                protectedMatchSnapshots[p.player.id] = protectedSnapshots;
            }

            protectedMatchSnapshots[p.player.id].push(protectedSnapshot);
        }
    });

    match.protectedMatchSnapshots = protectedMatchSnapshots;

    return match;
}