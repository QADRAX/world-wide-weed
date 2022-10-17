import React, { FunctionComponent } from 'react';
import { Header } from './Header/Header';
import { Paper } from '@mui/material';
import styled from "@emotion/styled";
import { useAuth } from '../hooks/useAuth';
import { LoaderContainer } from './LoaderContainer';

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

type WeedMainScreenProps = {
    children: React.ReactNode;
}

export const WeedMainScreen: FunctionComponent<WeedMainScreenProps> = (props) => {
    const { user } = useAuth();
    
    return (
        <RootContainer>
            <Header />
            <MainContainer>
                {user != null ? props.children : <LoaderContainer />}
            </MainContainer>
        </RootContainer>
    )
}