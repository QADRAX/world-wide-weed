import React, { FunctionComponent } from 'react';
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

export const WeedMainScreen: FunctionComponent = (props) => {
    return (
        <RootContainer>
            <Header />
            <MainContainer>
                {props.children}
            </MainContainer>
        </RootContainer>
    )
}