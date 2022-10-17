import { useAppSelector } from "../redux"

export const useOngoingMatches = () => {
    const ongoingMatchesDict = useAppSelector((state) => state.ongoingMatches.matches);
    const matches = Object.values(ongoingMatchesDict);

    return matches;
}