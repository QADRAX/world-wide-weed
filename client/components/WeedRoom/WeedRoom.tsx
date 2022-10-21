import { Button, Container, styled, Typography } from '@mui/material';
import React from 'react';
import { useCurrentPlayerRoom } from '../../redux/getters';
import { GameService } from '../../services/GameService';

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

    const leaveRoom = async () => {
        await GameService.leaveRoom();
    };

    return (
        <MainContainer maxWidth={false}>
            <Typography variant="h5" component="div" sx={{ padding: '16px', marginBottom: '16px' }}>
                {currentRoom.name}
            </Typography>

            <GameContainer maxWidth={false}>
            </GameContainer>

            <Button size="small" color="primary" onClick={leaveRoom}>Leave</Button>
        </MainContainer>
    )
}

