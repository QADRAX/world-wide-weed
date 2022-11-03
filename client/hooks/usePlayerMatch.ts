import { WeedPlayer } from "../../types/Player";
import { PublicMatchSnapshot } from "../../types/WeedTypes";
import { useAppSelector } from "./redux";
import { useAuthenticatedUser } from "./useAuth";

export function useCurrentHand(){
    const protectedSnapshots = useAppSelector((state) => state.match.protectedSnapshots);
    const currentSnap = protectedSnapshots[protectedSnapshots.length - 1];
    return currentSnap?.hand ?? [];
}

export function useCurrentMatchSnapshot(): PublicMatchSnapshot | undefined {
    const publicSnapshots = useAppSelector((state) => state.match.publicSnapshots);
    const currentSnap = publicSnapshots[publicSnapshots.length - 1];
    return currentSnap;
}

export function useCurrentTurn(){
    const publicSnapshots = useAppSelector((state) => state.match.publicSnapshots);
    const currentTurn = publicSnapshots.length - 1;
    return currentTurn;
}

export function useTotalTurns(){
    const currentSnap = useCurrentMatchSnapshot();
    const discardSize = currentSnap?.discards?.length ?? 0;
    const carsInHands = currentSnap?.players.reduce((acc, player) => acc + player.handSize, 0) ?? 0;
    const deckSize = currentSnap?.deckSize ?? 0;
    const total = deckSize + discardSize + carsInHands;
    return total;
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