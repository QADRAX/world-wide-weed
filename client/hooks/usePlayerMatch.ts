import { WeedPlayer } from "../../types/Player";
import { CardRequestSnapshot, PublicMatchSnapshot } from "../../types/WeedTypes";
import { useAppSelector } from "./redux";
import { useAuthenticatedUser } from "./useAuth";

export function useCurrentHand(){
    const protectedSnapshots = useAppSelector((state) => state.match.protectedSnapshots) || [];
    const currentSnap = protectedSnapshots[protectedSnapshots.length - 1];
    return currentSnap?.hand ?? [];
}

export function useCurrentMatchSnapshot(): PublicMatchSnapshot | undefined {
    const publicSnapshots = useAppSelector((state) => state.match.publicSnapshots) || [];
    const currentSnap = publicSnapshots[publicSnapshots.length - 1];
    return currentSnap;
}

export function useCurrentTurn(){
    const publicSnapshots = useAppSelector((state) => state.match.publicSnapshots);
    const currentTurn = publicSnapshots ? publicSnapshots.length - 1 : 0;
    return currentTurn;
}

export function useCurrentDeckSchema(){
    const deckSchema = useAppSelector((state) => state.match.deckSchema);
    return deckSchema;
}

export function useTotalTurns(){
    const currentSnap = useCurrentMatchSnapshot();
    const discardSize = currentSnap?.discards?.length ?? 0;
    const carsInHands = currentSnap?.players.reduce((acc, player) => acc + player.handSize, 0) ?? 0;
    const deckSize = currentSnap?.deckSize ?? 0;
    const total = deckSize + discardSize + carsInHands;
    return total;
}

export function useIsGameOver(){
    const totalTurns = useTotalTurns();
    const currentTurn = useCurrentTurn();
    if(totalTurns === 0) {
        return false;
    }
    const isGameOver = currentTurn + 1 > totalTurns;
    return isGameOver;
}

export function useCurrentPlayer(): {
    currentPlayer: WeedPlayer | undefined;
    isBriked: boolean;
} {
    const currentTurn = useCurrentTurn();
    const players = useAppSelector((state) => state.match.players);
    const isBriked = useAppSelector((state) => state.match.isCurrentPlayerBriked);
    const numberOfPlayers = players.length;
    const currentPlayerIndex = currentTurn % numberOfPlayers;
    const currentPlayer: WeedPlayer | undefined = players[currentPlayerIndex];

    return { currentPlayer, isBriked };
}

export function useIsCurrentPlayerTurn(){
    const { user } = useAuthenticatedUser();
    const { currentPlayer } = useCurrentPlayer();
    
    const isCurrentPlayerTurn = user.id === currentPlayer?.id;
    return isCurrentPlayerTurn;
}

export function useIsCurrentPlayerBriked() {
    const isBriked = useAppSelector((state) => state.match.isCurrentPlayerBriked);
    const isCurrentPlayerTurn = useIsCurrentPlayerTurn();
    const isCurrentPlayerBriked = isBriked && isCurrentPlayerTurn;
    return isCurrentPlayerBriked;
}

export function useSelectedCardType(){
    const selectedCardId = useAppSelector((state) => state.match.selectedCardId);
    const currentHand = useCurrentHand();
    const selectedCard = currentHand.find((card) => card.id === selectedCardId);
    return selectedCard?.type;
}

export function useSelectedTargetField() {
    const targetFieldId = useAppSelector((state) => state.match.tagetFieldId);
    const currentSnap = useCurrentMatchSnapshot();
    const player = currentSnap?.players.find((player) => player.fields.some((field) => field.id === targetFieldId));
    const field = player?.fields.find((field) => field.id === targetFieldId);
    return { player, field };
}

export function useSelectedDestinationField() {
    const destinationFieldId = useAppSelector((state) => state.match.destinationFieldId);
    const currentSnap = useCurrentMatchSnapshot();
    const player = currentSnap?.players.find((player) => player.fields.some((field) => field.id === destinationFieldId));
    const field = player?.fields.find((field) => field.id === destinationFieldId);
    return { player, field };
}

export function useIsValidSelection() {
    const selectedCardType = useSelectedCardType();
    const { field: targetField } = useSelectedTargetField();
    const { field: destinationField } = useSelectedDestinationField();

    let isValid = false;
    if (selectedCardType) {
        if (selectedCardType === 'stealer') {
            isValid = !!destinationField;
        } else {
            isValid = !!targetField;
        }
    }
    return isValid;
}

export function useLastCardRequest(): CardRequestSnapshot | undefined {
    const history = useAppSelector((state) => state.match.cardRequestHistory) ?? [];
    const lastCardRequest: CardRequestSnapshot | undefined = history[history.length - 1];
    return lastCardRequest;
} 