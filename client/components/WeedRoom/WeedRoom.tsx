import { Button, Container, Divider, Stack, styled, Typography } from '@mui/material';
import React from 'react';
import { getRoomStatusText } from '../../../shared/weedUtils';
import { useCurrentPlayerRoom } from '../../redux/getters';
import { GameService } from '../../services/GameService';
import { Lobby } from './Lobby/Lobby';
import { Match } from './Match/Match';

const MainContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
});

const GameContainer = styled(Container)({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
});

export const WeedRoom = () => {
    const currentRoom = useCurrentPlayerRoom();

    const isMatchStarted = currentRoom.matchId != null;

    const roomStatusText = getRoomStatusText(currentRoom);

    const leaveRoom = async () => {
        await GameService.leaveRoom();
    };

    return (
        <MainContainer maxWidth={false}>
            <Stack direction="row" alignItems="baseline" spacing={2} sx={{ p: 1 }}>
                <Typography variant="h5" component="div" sx={{ p: 1 }}>
                    {currentRoom.name}
                </Typography>
                <Typography color="text.secondary">
                    {roomStatusText}
                </Typography>
            </Stack>


            <Divider sx={{ mb: 1 }}></Divider>

            <GameContainer maxWidth={false}>
                {
                    isMatchStarted
                        ? <Match />
                        : <Lobby />
                }

            </GameContainer>
            <Divider sx={{ mb: 1, mt: 1 }}></Divider>
            <Button size="small" color="primary" sx={{ mb: 1 }} onClick={leaveRoom}>Leave</Button>
        </MainContainer>
    )
}

