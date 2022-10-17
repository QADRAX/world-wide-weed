import React from 'react';
import { WelcomePage } from './WelcomePage';
import { Header } from './Header/Header';
import { Paper } from '@mui/material';
import styled from "@emotion/styled";

const RootContainer = styled("div")({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: "rgb(228 249 239)",
});

const MainContainer = styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: '16px',
    padding: '16px',
    overflow: 'auto',
});


export const WeedMainScreen = () => {
    return (
        <RootContainer>
            <Header />
            <MainContainer>
                <WelcomePage />
            </MainContainer>
        </RootContainer>
    )
}