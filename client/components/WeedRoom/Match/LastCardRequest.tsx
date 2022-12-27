import { Divider, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { ANIMATION_VERTICAL_FADE } from '../../../config/animations';
import { useAppSelector } from '../../../hooks/redux';
import { useCurrentMatchSnapshot, useLastCardRequest } from '../../../hooks/usePlayerMatch';
import { CardRequestInfo } from '../../Shared/CardRequestInfo';

export const LastCardRequest = () => {
    const lastCard = useLastCardRequest();
    const players = useAppSelector((state) => state.match.players);
    const currentSnap = useCurrentMatchSnapshot();

    if (!lastCard || !currentSnap) {
        return null;
    }

    const request = lastCard.request;

    return (
        <Stack direction="column" sx={{
            mt: 1,
        }}>
            <CardRequestInfo cardRequest={request} players={players} />
            <Divider flexItem
                sx={{
                    mt: 1,
                }}
                component={motion.div}
                {...ANIMATION_VERTICAL_FADE}>
            </Divider>
        </Stack>
    )
};