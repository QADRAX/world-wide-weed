import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { getRoomStatusText } from '../../../shared/weedUtils';
import { toArray } from '../../../utils/Dict';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useAuthenticatedUser } from '../../hooks/useAuth';
import { useCurrentPlayerRoom } from '../../hooks/usePlayerRoom';
import { setIsLoading } from '../../redux/rooms/rooms';
import { GameService } from '../../services/GameService';
import { MainCard } from '../Shared/MainCard';
import { Lobby } from './Lobby/Lobby';
import { Match } from './Match/Match';

export const WeedRoom = () => {
    const isLoading = useAppSelector(state => state.rooms.isLoading);
    const { user } = useAuthenticatedUser();
    const dispatch = useAppDispatch();
    const currentRoom = useCurrentPlayerRoom();

    const readyPlayersIdsDict = currentRoom.readyPlayersIds ?? {};
    const readyPlayersIds = toArray(readyPlayersIdsDict);

    const isPlayerReady = readyPlayersIds.includes(user.id);

    const isMatchStarted = currentRoom.matchId != null;

    const roomStatusText = getRoomStatusText(currentRoom);

    const leaveRoom = async () => {
        dispatch(setIsLoading(true));
        await GameService.leaveRoom();
        dispatch(setIsLoading(false));
    };

    const setReady = async () => {
        dispatch(setIsLoading(true));
        await GameService.readyToPlay({ isReady: true });
        dispatch(setIsLoading(false));
    };

    const setNotReady = async () => {
        dispatch(setIsLoading(true));
        await GameService.readyToPlay({ isReady: false });
        dispatch(setIsLoading(false));
    };

    return (
        <MainCard
            title={
                <>
                    <Typography variant="h5" component="div" sx={{ p: 1 }}>
                        {currentRoom.name}
                    </Typography>
                    <Typography color="text.secondary">
                        {roomStatusText}
                    </Typography>
                </>
            }
            footer={
                !isMatchStarted && (
                    <>
                        {
                            isPlayerReady ? (
                                <LoadingButton
                                    loading={isLoading}
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={setNotReady}>
                                    Not Ready
                                </LoadingButton>
                            ) : (
                                <LoadingButton
                                    size="small"
                                    loading={isLoading}
                                    variant="contained"
                                    color="success"
                                    onClick={setReady}>
                                    Ready
                                </LoadingButton>
                            )
                        }
                        <Button
                            size="small"
                            fullWidth
                            color="error"
                            disabled={isPlayerReady || isLoading}
                            onClick={leaveRoom}>
                            Leave
                        </Button>
                    </>
                )
            }
        >
            {
                isMatchStarted
                    ? <Match />
                    : <Lobby />
            }
        </MainCard>
    )
}

