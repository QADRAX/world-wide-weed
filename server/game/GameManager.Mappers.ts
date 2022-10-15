import { ClientSideMatch } from "types/SocketMessages";
import { ClientSideMatchPlayerSnapShot, ClientSideMatchSnapShot } from "types/weed/WeedTypes";
import { Player } from "types/Player";
import { WeedMatch } from "./weedMatch/WeedMatch";

export function toClientSideMatch<P extends Player>(weedMatch: WeedMatch<P>) {
    const result: ClientSideMatch<P> = {
        history: weedMatch.history.map((h) => {
            const matchSnap: ClientSideMatchSnapShot<P> = {
                discards: h.discards,
                players: h.players.map((p) => {
                    const matchPlayer: ClientSideMatchPlayerSnapShot<P> = {
                        fields: p.fields,
                        smokedScore: p.smokedScore,
                        player: p.player,
                    };
                    return matchPlayer;
                }),
                deckSize: h.deck.length,
            };
            return matchSnap;
        }),
        requestHistory: weedMatch.requestHistory,
    }
    return result;
}