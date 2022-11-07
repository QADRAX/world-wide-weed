import { useEffect } from "react";
import { useCurrentPlayerMatchId } from "./usePlayerRoom";
import { GameService } from "../services/GameService";
import { useAppDispatch } from "./redux";
import { setCardRequestHistory, setIsCurrentPlayerBriked, setMatchPlayers, setProtectedSnapshots, setPublicSnapshots } from "../redux/match/match";
import { useAuthenticatedUser } from "./useAuth";

export const useInitMatch = () => {
    const { user } = useAuthenticatedUser();
    const matchId = useCurrentPlayerMatchId();
    const dispatch = useAppDispatch();

    useEffect(() => {
        let unsubscribePublic: (() => void) | undefined = undefined;
        let unsubscribeProtected: (() => void) | undefined = undefined;
        let unsubscribeIsCurrentPlayerBriked: (() => void) | undefined = undefined;
        let unsubscribeCardRequestHistory: (() => void) | undefined = undefined;

        (async () => {
            const publicSnapshots = await GameService.getPublicMatchSnapshots(matchId);
            dispatch(setPublicSnapshots(publicSnapshots));
            const protectedSnapshots = await GameService.getProtectedMatchSnapshots(user.id, matchId);
            dispatch(setProtectedSnapshots(protectedSnapshots));
            const matchPlayers = await GameService.getMatchPlayers(matchId);
            dispatch(setMatchPlayers(matchPlayers));

            unsubscribePublic = GameService.subscribeToPublicMatchSnapshots(matchId, (snapshots) => {
                dispatch(setPublicSnapshots(snapshots));
            });

            unsubscribeProtected = GameService.subscribeToProtectedMatchSnapshots(
                user.id,
                matchId,
                (snapshots) => {
                    dispatch(setProtectedSnapshots(snapshots));
                }
            );

            unsubscribeIsCurrentPlayerBriked = GameService.subscribeToIsCurrentPlayerBriked(
                matchId,
                (isBriked) => {
                    dispatch(setIsCurrentPlayerBriked(isBriked));
                }
            );

            unsubscribeCardRequestHistory = GameService.subscribeToCardRequestHistory(
                matchId,
                (cardRequestHistory) => {
                    dispatch(setCardRequestHistory(cardRequestHistory));
                }
            );

        })();

        return () => {
            if (unsubscribePublic) {
                unsubscribePublic();
            }
            if (unsubscribeProtected) {
                unsubscribeProtected();
            }
            if (unsubscribeIsCurrentPlayerBriked) {
                unsubscribeIsCurrentPlayerBriked();
            }
            if (unsubscribeCardRequestHistory) {
                unsubscribeCardRequestHistory();
            }
        };
    }, [dispatch, matchId, user]);
};
