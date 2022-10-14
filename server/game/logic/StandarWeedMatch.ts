import { MatchPlayer, MatchSnapshot } from "types/weed/WeedTypes";
import { WeedPlayer } from "types/WeedPlayer";
import { shuffle } from "utils/shuffle";
import { getDeck } from "./WeedMatch.Decks";
import { getInitialFields } from "./WeedMatch.Fields";
import { WeedMatch } from "./WeedMatch";

export class StandarWeedMatch extends WeedMatch {

    constructor(players: WeedPlayer[]) {
        const deck = shuffle(getDeck());
        const matchPlayers: MatchPlayer[] = shuffle(players.map((player) => {
            const initialFields = getInitialFields(players.length);
            const matchPlayer: MatchPlayer = {
                hand: [],
                fields: initialFields,
                playerId: player.id,
                smokedScore: 0,
            };
            return matchPlayer;
        }));
        const initialSnapshot: MatchSnapshot = {
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