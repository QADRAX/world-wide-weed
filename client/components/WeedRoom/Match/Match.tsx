import { Box, styled } from '@mui/material';
import React from 'react';
import { useInitMatch } from '../../../hooks/useInitMatch';
import { GameBoard } from './GameBoard';
import { Hand } from './Hand';

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
            <GameBoardContainer>
                <GameBoard />
            </GameBoardContainer>
            
            <Hand />
        </MainContainer>
    )
};