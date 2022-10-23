import React, { FunctionComponent, useEffect } from 'react';
import { Header } from '../Header/Header';
import { Paper, styled } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { LoaderContainer } from '../LoaderContainer';
import { UserInfo } from '../../../types/UserInfo';

const RootContainer = styled("div")(({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: "rgb(234 243 238)",
}));

const MainContainer = styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: '16px',
    overflow: 'auto',
});

type WeedMainScreenProps = {
    children: React.ReactNode;
    userInfo: UserInfo;
}

export const MainScreen: FunctionComponent<WeedMainScreenProps> = (props) => {
    const { setUser, user } = useAuth();
    useEffect(() => setUser(props.userInfo), []);
    if(user == null) {
        return <LoaderContainer />;
    }
    return (
        <RootContainer>
            <Header />
            <MainContainer elevation={5}>
                {props.children}
            </MainContainer>
        </RootContainer>
    )
}