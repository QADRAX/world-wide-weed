import { MatchPlayer, MatchSnapshot } from "server/types/weed/WeedTypes";
import { Player } from "server/types/Player";
import { shuffle } from "../../utils/shuffle";
import { getDeck } from "./WeedMatch.Decks";
import { getInitialFields } from "./WeedMatch.Fields";
import { WeedMatch } from "./WeedMatch";

export class StandarWeedMatch<P extends Player> extends WeedMatch<P> {
    isStandar: boolean = true;

    constructor(players: P[]) {
        const deck = shuffle(getDeck());
        const matchPlayers: MatchPlayer<P>[] = shuffle(players.map((player) => {
            const initialFields = getInitialFields(players.length);
            const matchPlayer: MatchPlayer<P> = {
                hand: [],
                fields: initialFields,
                player,
                smokedScore: 0,
            };
            return matchPlayer;
        }));
        const initialSnapshot: MatchSnapshot<P> = {
            players: matchPlayers,
            deck,
            discards: [],
        };

        // initial drawing

        initialSnapshot.players.forEach((player) => {
            player.fields.forEach(() => {
                const drawedCard = initialSnapshot.deck.pop();
                if (drawedCard) {
                    player.hand.push(drawedCard);
                }
            });
        });
        super(initialSnapshot);
    }

}