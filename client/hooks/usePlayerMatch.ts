import { useAppSelector } from "./redux";

export function useCurrentHand(){
    const protectedSnapshots = useAppSelector((state) => state.match.protectedSnapshots);
    const currentSnap = protectedSnapshots[protectedSnapshots.length - 1];
    return currentSnap?.hand ?? [];
}

export function useCurrentBoard(){
    const publicSnapshots = useAppSelector((state) => state.match.publicSnapshots);
    const currentSnap = publicSnapshots[publicSnapshots.length - 1];
    return currentSnap;
}

export function useCurrentTurn(){
    const publicSnapshots = useAppSelector((state) => state.match.publicSnapshots);
    const currentTurn = publicSnapshots.length - 1;
    return currentTurn;
}

export function useCurrentPlayer(){
    const currentTurn = useCurrentTurn();
    const players = useAppSelector((state) => state.match.players);
    const isBriked = useAppSelector((state) => state.match.isCurrentPlayerBriked);
    const numberOfPlayers = players.length;
    const currentPlayerIndex = currentTurn % numberOfPlayers;
    const currentPlayer = players[currentPlayerIndex];

    return { currentPlayer, isBriked };
}

