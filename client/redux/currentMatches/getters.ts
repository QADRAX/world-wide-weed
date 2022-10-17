import { MatchesDict } from "../../../types/weed/WeedTypes";
import { useAppSelector } from "../../hooks/redux";
import { useAuth } from "../../hooks/useAuth";

export const useOngoingMatches = () => {
    const ongoingMatchesDict: MatchesDict = useAppSelector((state) => state.ongoingMatches.matches);
    const matches = Object.values(ongoingMatchesDict ?? {});

    return matches;
}

export const useCurrentPlayerMatches = () => {
    const { user } = useAuth();
    const matches = useOngoingMatches();

    const playerMatches = matches.filter((m) => m.onGoingPlayer.find(((p) => p.player.id == user?.uid)) != null);

    return playerMatches;
}