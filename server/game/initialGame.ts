import { WeedPlayer } from "../../types/Player";
import { PrivateMatchPlayer, PrivateMatchSnapshot } from "../../types/weed/WeedTypes";
import { shuffle } from "../../utils/ArrayShuffle";
import { getDeck } from "./decks";
import { getInitialFields } from "./fields";

export const getInitialMatchSnapshot = (players: WeedPlayer[]): PrivateMatchSnapshot => {
    const deck = shuffle(getDeck());
    const matchPlayers: PrivateMatchPlayer[] = shuffle(players.map((player) => {
        const initialFields = getInitialFields(players.length);
        const matchPlayer: PrivateMatchPlayer = {
            fields: initialFields,
            player,
            smokedScore: 0,
            hand: [],
        };
        return matchPlayer;
    }));
    const initialSnapshot: PrivateMatchSnapshot = {
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

    return initialSnapshot;
}