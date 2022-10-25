import { Stack } from '@mui/system';
import React from 'react';
import { useCurrentHand } from '../../../hooks/usePlayerMatch';
import { WeedCard } from './WeedCard';

export const Hand = () => {
    const hand = useCurrentHand();
    console.log(hand);
    return (
        <Stack direction="row">
            {hand.map((card) => (
                <WeedCard key={card.id} cardType={card.type} />
            ))}
        </Stack>
    );
};