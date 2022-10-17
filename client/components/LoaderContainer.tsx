import { CircularProgress } from '@mui/material';
import React from 'react';
import styled from "@emotion/styled";

const LoaderCenteredContainer = styled("div")({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    widht: '100%',
    alignContent: 'center',
    alignItems: 'center',
});


export const LoaderContainer = () => {
    return (
        <LoaderCenteredContainer>
            <CircularProgress />
        </LoaderCenteredContainer>
    )
}