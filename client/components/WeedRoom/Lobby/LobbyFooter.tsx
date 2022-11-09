import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useIsCurrentPlayerReady } from '../../../hooks/usePlayerRoom';
import { setIsLoading } from '../../../redux/rooms/rooms';
import { GameService } from '../../../services/GameService';

export const LobbyFooter = () => {
    const isLoading = useAppSelector(state => state.rooms.isLoading);
    const dispatch = useAppDispatch();
    const isPlayerReady = useIsCurrentPlayerReady();

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
    );
};