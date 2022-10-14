import { Match, MatchPlayer, MatchSnapshot } from "types/weed/WeedTypes";
import { WeedPlayer } from "types/WeedPlayer";
import { shuffle } from "utils/shuffle";
import { getDeck } from "./decks";
import { getInitialFields } from "./Fields";

export class ImlMatch implements Match {
    currentSnapshot: MatchSnapshot;
    history: MatchSnapshot[];

    get numberOfPlayers() {
        return this.currentSnapshot.players.length;
    }

    get currentTurn() {
        return this.history.length;
    }

    get currentPlayerIndex() {
        return this.currentTurn % this.numberOfPlayers;
    }

    get currentPlayerId() {
        return this.currentSnapshot.players[this.currentPlayerIndex].playerId;
    }

    get isCurrentPlayerBrick() {
        return false;
    }

    get deckSike() {
        return this.currentSnapshot.deck.length;
    }

    get isGameOver() {
        const emptyHandsPlayers = this.currentSnapshot.players.filter((p) => p.hand.length == 0);
        const isEmptyHandsForAllPlayers = emptyHandsPlayers.length == this.numberOfPlayers;
        const isDeckEmpty = this.deckSike == 0;
        const isGameOver = isEmptyHandsForAllPlayers && isDeckEmpty;
        return isGameOver;
    }

    constructor(players: WeedPlayer[]) {
        this.history = [];

        const deck = shuffle(getDeck());
        const matchPlayers: MatchPlayer[] = shuffle(players.map((player) => {
            const initialFields = getInitialFields(players.length);
            const matchPlayer: MatchPlayer = {
                hand: [],
                fields: initialFields,
                playerId: player.id,
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
                if(drawedCard){
                    player.hand.push(drawedCard);
                }
            });
        });

        this.currentSnapshot = initialSnapshot;
    }


}