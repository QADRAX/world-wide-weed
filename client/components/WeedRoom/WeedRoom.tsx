import { Button, Container, Divider, styled, Typography } from '@mui/material';
import React from 'react';
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
    overflow: 'auto',
});

export const WeedRoom = () => {
    const currentRoom = useCurrentPlayerRoom();

    const isMatchStarted = currentRoom.matchId != null;

    const leaveRoom = async () => {
        await GameService.leaveRoom();
    };

    return (
        <MainContainer maxWidth={false}>
            <Typography variant="h5" component="div" sx={{ p: 2 }}>
                {currentRoom.name}
            </Typography>

            <Divider sx={{ mb: 2 }}></Divider>

            <GameContainer maxWidth={false}>
                {
                    isMatchStarted
                        ? <Match />
                        : <Lobby />
                }

            </GameContainer>
            <Divider sx={{ mb: 2 }}></Divider>
            <Button size="small" color="primary" sx={{ mb: 2 }} onClick={leaveRoom}>Leave</Button>
        </MainContainer>
    )
}

