import { Container, styled } from '@mui/material';
import React from 'react';
import { useCurrentPlayerRoom } from '../../../redux/getters';

const MainContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
});


export const Lobby = () => {
    const currentRoom = useCurrentPlayerRoom();
    
    
    return (
        <MainContainer>
            <p>KLK</p>
        </MainContainer>
    )
};
