import { getPlayerPoints } from "../../../../shared/gameLogic";
import { WeedPlayer } from "../../../../types/Player";
import { CardRequestSnapshot } from "../../../../types/WeedTypes";
import { LastMatch } from "../../../redux/lastMatch/lastMatch";

export type WeedInfoPlayer = {
    weedPlayer: WeedPlayer;
    isWinner: boolean;
    isLoser: boolean;
    points: number;
    requests: CardRequestSnapshot[];
}

export function getMatchInfo(
    lastMatch: LastMatch,
): WeedInfoPlayer[] {
    if (!lastMatch || !lastMatch.players || !lastMatch.publicSnapshots || !lastMatch.cardRequestHistory) {
        return [];
    }

    const lastSnapshot = lastMatch.publicSnapshots[lastMatch.publicSnapshots.length - 1];
    const lastSnapshotPlayers = lastSnapshot.players;

    const weedInfoPlayers = lastMatch.players.map((player) => {
        const weedInfoPlayer: WeedInfoPlayer = {
            weedPlayer: player,
            isWinner: false,
            isLoser: false,
            requests: [],
            points: 0,
        };

        const lastSnapshotPlayer = lastSnapshotPlayers.find((p) => p.playerId === player.id);
        if (lastSnapshotPlayer) {
            const points = getPlayerPoints(lastSnapshotPlayer);
            weedInfoPlayer.points = points;
        }

        return weedInfoPlayer;
    });

    const sortedWeedInfoPlayers = weedInfoPlayers.sort((a, b) => b.points - a.points);

    const winnerPoints = sortedWeedInfoPlayers[0].points;
    const loserPoints = sortedWeedInfoPlayers[sortedWeedInfoPlayers.length - 1].points;

    sortedWeedInfoPlayers.forEach((player) => {
        if (player.points === winnerPoints) {
            player.isWinner = true;
        }
        if (player.points === loserPoints) {
            player.isLoser = true;
        }

        const request = lastMatch.cardRequestHistory?.filter((req) => {
            return req.request.playerId === player.weedPlayer.id;
        }) ?? [];

        player.requests = request;
    });

    return weedInfoPlayers;
}