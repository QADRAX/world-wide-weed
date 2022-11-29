import { useEffect } from "react";
import { useCurrentPlayerMatchId } from "./usePlayerRoom";
import { GameService } from "../services/GameService";
import { useAppDispatch, useAppSelector } from "./redux";
import {
    setCardRequestHistory,
    setIsCurrentPlayerBriked,
    setMatchPlayers,
    setProtectedSnapshots,
    setPublicSnapshots
} from "../redux/match/match";
import { useAuthenticatedUser } from "./useAuth";
import { useIsGameOver } from "./usePlayerMatch";
import { LastMatch, setLastMatch } from "../redux/lastMatch/lastMatch";

export const useInitMatch = () => {
    const { user } = useAuthenticatedUser();
    const matchId = useCurrentPlayerMatchId();
    const dispatch = useAppDispatch();
    const isGameOver = useIsGameOver();
    const match = useAppSelector(state => state.match);

    useEffect(() => {
        let unsubscribePublic: (() => void) | undefined = undefined;
        let unsubscribeProtected: (() => void) | undefined = undefined;
        let unsubscribeIsCurrentPlayerBriked: (() => void) | undefined = undefined;
        let unsubscribeCardRequestHistory: (() => void) | undefined = undefined;

        if (matchId && !isGameOver) {
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
        } else {
            // MATCH IS OVER

            const lastMatch: LastMatch = {
                publicSnapshots: match.publicSnapshots,
                cardRequestHistory: match.cardRequestHistory,
                players: match.players,
            };

            dispatch(setLastMatch(lastMatch));
        }

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

    }, [dispatch, matchId, user, isGameOver]);
};
