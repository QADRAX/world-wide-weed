import { useAppSelector } from "./redux";

export function usePlayerHand(){
    const protectedSnapshots = useAppSelector((state) => state.match.protectedSnapshots);
    const currentSnap = protectedSnapshots[protectedSnapshots.length - 1];
    return currentSnap?.hand ?? [];
}

export function useCurrentBoard(){
    const publicSnapshots = useAppSelector((state) => state.match.publicSnapshots);
    const currentSnap = publicSnapshots[publicSnapshots.length - 1];
    return currentSnap;
}