import { Box, styled } from '@mui/material';
import React from 'react';
import { useInitMatch } from '../../../hooks/useInitMatch';
import { GameBoard } from './GameBoard';
import { Hand } from './Hand';
import { LastCardRequest } from './LastCardRequest';

const MainContainer = styled("div")({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
});

const GameBoardContainer = styled(Box)({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
});

export const Match = () => {
    useInitMatch();
    
    return (
        <MainContainer>
            <LastCardRequest />
            <GameBoardContainer>
                <GameBoard />
            </GameBoardContainer>
            
            <Hand />
        </MainContainer>
    )
};