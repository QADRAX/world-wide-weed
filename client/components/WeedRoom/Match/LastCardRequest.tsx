import { Divider, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { isPlayCardRequest } from '../../../../types/WeedTypes';
import { ANIMATION_VERTICAL_FADE } from '../../../config/animations';
import { useAppSelector } from '../../../hooks/redux';
import { useCurrentMatchSnapshot, useLastCardRequest } from '../../../hooks/usePlayerMatch';
import { WeedCard } from './WeedCard';

export const LastCardRequest = () => {
    const lastCard = useLastCardRequest();
    const players = useAppSelector((state) => state.match.players);
    const currentSnap = useCurrentMatchSnapshot();

    if (!lastCard || !currentSnap) {
        return null;
    }

    const request = lastCard.request;
    const lastPlayerId = request.playerId;
    const lastPlayer = players.find((p) => p.id === lastPlayerId);

    if (!lastPlayer) {
        return null;
    }

    let playerInfoText = '';
    let targetInfoText = '';

    if (isPlayCardRequest(request)) {

        const lastTargetPlayer = players.find((p) => p.id === request.targetPlayerId);
        if (!lastTargetPlayer) {
            return null;
        }

        playerInfoText = `${lastPlayer.name} played`;

        if(lastTargetPlayer.id === lastPlayer.id) {
            targetInfoText = `against himself`;
        } else {
            targetInfoText = `against ${lastTargetPlayer.name}`;
        }
        

    } else {
        playerInfoText = `${lastPlayer.name} discarded`;
    }


    return (
        <Stack direction="column">
            <Stack direction="row"
                justifyContent='center'
                spacing={1}
                sx={{
                    alignItems: 'center',
                    mt: 1,
                }} >
                <Typography variant="caption"
                    sx={{
                        cursor: 'default',
                    }}>
                    {playerInfoText}
                </Typography>
                <WeedCard cardType={request.cardType} width={20} height={30} />
                <Typography variant="caption"
                    sx={{
                        cursor: 'default',
                    }}>
                    {targetInfoText}
                </Typography>
            </Stack>
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