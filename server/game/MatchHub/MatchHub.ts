import { Player } from "server/types/Player";
import { StandarWeedMatch } from "../weedMatch/StandarWeedMatch";
import { WeedMatch } from "../weedMatch/WeedMatch";
import { setHasSomeKey } from "../../utils/equalSet";

export class MatchHub<P extends Player>{
    private standarMatches: Map<Set<string>, StandarWeedMatch<P>>;

    constructor() {
        this.standarMatches = new Map<Set<string>, StandarWeedMatch<P>>();
    }

    createStandarMatch(players: P[]): WeedMatch<P> | undefined {
        const playerIds = players.map((p) => p.id);
        const newMatchKey = new Set<string>(playerIds);

        let isSomePlayerMatched = false;
        for (const key of this.standarMatches.keys()) {
            isSomePlayerMatched = setHasSomeKey(key, newMatchKey);
            if (isSomePlayerMatched) {
                break;
            }
        }

        if (!isSomePlayerMatched) {
            const newMatch = new StandarWeedMatch(players);
            this.standarMatches.set(newMatchKey, newMatch);
            return newMatch;
        } else {
            return undefined;
        }
    }

    findPlayerMatch(player: P): WeedMatch<P> | undefined {
        for (const key of this.standarMatches.keys()) {
            const isPlayerInMatch = key.has(player.id);
            if (isPlayerInMatch) {
                const playerMatch = this.standarMatches.get(key);
                return playerMatch;
            }
        }

        return undefined;
    }




}