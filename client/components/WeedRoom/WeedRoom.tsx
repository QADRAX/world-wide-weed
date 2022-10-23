import { Button, Typography } from '@mui/material';
import React from 'react';
import { getRoomStatusText } from '../../../shared/weedUtils';
import { useCurrentPlayerRoom } from '../../redux/getters';
import { GameService } from '../../services/GameService';
import { MainCard } from '../MainCard';
import { Lobby } from './Lobby/Lobby';
import { Match } from './Match/Match';

export const WeedRoom = () => {
    const currentRoom = useCurrentPlayerRoom();

    const isMatchStarted = currentRoom.matchId != null;

    const roomStatusText = getRoomStatusText(currentRoom);

    const leaveRoom = async () => {
        await GameService.leaveRoom();
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
                        <Button size="small" fullWidth color="primary" variant='contained' onClick={leaveRoom}>Ready</Button>
                        <Button size="small" fullWidth color="error" onClick={leaveRoom}>Leave</Button>
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

