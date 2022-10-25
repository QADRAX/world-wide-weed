import { Divider } from '@mui/material';
import { Stack } from '@mui/system';
import { motion } from 'framer-motion';
import React from 'react';
import { ANIMATION_VERTICAL_FADE } from '../../../config/animations';
import { useAuthenticatedUser } from '../../../hooks/useAuth';
import { useCurrentHand, useCurrentPlayer } from '../../../hooks/usePlayerMatch';
import { WeedCard } from './WeedCard';

export const Hand = () => {
    const hand = useCurrentHand();
    const { user } = useAuthenticatedUser();
    const { currentPlayer } = useCurrentPlayer();

    if (currentPlayer == null) {
        return null;
    }

    const isCurrentPlayerTurn = user.id === currentPlayer.id;

    return (
        <Stack direction="column">
            <Divider flexItem sx={{ mb: 3 }} component={motion.div} {...ANIMATION_VERTICAL_FADE}>
                Your hand
            </Divider>
            <Stack sx={{ ml: 2, mr: 2, mb: 2 }} direction="row" spacing={1} justifyContent="center" alignItems="center">
                {hand.map((card) => (
                    <WeedCard key={card.id} cardType={card.type} disabled={!isCurrentPlayerTurn} />
                ))}
            </Stack>
        </Stack>

    );
};