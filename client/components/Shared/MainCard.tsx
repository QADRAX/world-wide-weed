import { Container, Divider, Stack, styled } from '@mui/material';
import React, { FunctionComponent } from 'react';

const MainContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
});

const BodyContainer = styled(Container)({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
});

export type MainCardProps = {
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
};

export const MainCard: FunctionComponent<MainCardProps> = (props) => {
    return (
        <MainContainer maxWidth={false}>
            <Stack direction="row" alignItems="baseline" spacing={2} sx={{ p: 1 }}>
                {props.title}
            </Stack>


            <Divider sx={{ mb: 1 }}></Divider>

            <BodyContainer maxWidth={false}>
                {props.children}
            </BodyContainer>
            {
                props.footer && (
                    <>
                        <Divider sx={{ mb: 1, mt: 1 }}></Divider>
                        <Stack direction="column" spacing={1} justifyContent="center" alignItems='center' sx={{ mb: 1 }}>
                            {props.footer}
                        </Stack>
                    </>
                )
            }
        </MainContainer>
    );
};