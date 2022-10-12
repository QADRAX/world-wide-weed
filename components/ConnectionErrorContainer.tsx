import React from 'react';
import styled from "@emotion/styled";
import ErrorIcon from '@mui/icons-material/Error';

const CenteredContainer = styled("div")({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    widht: '100%',
    alignContent: 'center',
    alignItems: 'center',
});

export const ConnectionErrorContainer = () => {
    return (
        <CenteredContainer>
            <ErrorIcon />
            <p>Server refuse the connexion... Please try again!</p>
        </CenteredContainer>
    );
};