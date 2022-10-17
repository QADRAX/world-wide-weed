import { MatchesDict } from "../../../types/weed/WeedTypes";
import { useAppSelector } from "../redux"

export const useOngoingMatches = () => {
    const ongoingMatchesDict: MatchesDict = useAppSelector((state) => state.ongoingMatches.matches);
    const matches = Object.values(ongoingMatchesDict ?? {});

    return matches;
}

export const useCurrentPlayerMatch = () => {
    
}