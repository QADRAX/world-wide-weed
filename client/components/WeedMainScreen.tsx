import React, { FunctionComponent, useEffect } from 'react';
import { Header } from './Header/Header';
import { Paper } from '@mui/material';
import styled from "@emotion/styled";
import { useAuth } from '../hooks/useAuth';
import { LoaderContainer } from './LoaderContainer';
import { UserInfo } from '../../types/UserInfo';

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
    userInfo: UserInfo;
}

export const WeedMainScreen: FunctionComponent<WeedMainScreenProps> = (props) => {
    const { setUser, user } = useAuth();
    useEffect(() => setUser(props.userInfo), []);
    if(user == null) {
        return <LoaderContainer />;
    }
    return (
        <RootContainer>
            <Header />
            <MainContainer>
                {props.children}
            </MainContainer>
        </RootContainer>
    )
}