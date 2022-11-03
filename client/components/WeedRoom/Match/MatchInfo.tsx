import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { useCurrentMatchSnapshot, useCurrentPlayer, useCurrentTurn, useIsCurrentPlayerTurn, useTotalTurns } from '../../../hooks/usePlayerMatch';

export const MatchInfo = () => {
    const currentTurn = useCurrentTurn();
    const totalTurns = useTotalTurns();
    const { currentPlayer } = useCurrentPlayer();
    const isCurrentPlayerTurn = useIsCurrentPlayerTurn();
    const currentSnap = useCurrentMatchSnapshot();

    const turnText = `Turn: ${currentTurn}/${totalTurns}`;
    const playerText = isCurrentPlayerTurn ? `It's your turn` : `Turn of: ${currentPlayer?.name}`;
    const deckSize = currentSnap?.deckSize ?? 0;
    const deckText = `Deck size: ${deckSize}`;

    return (
        <Stack direction="row">
            <Typography color="text.primary">
                {playerText}
            </Typography>
            <Divider flexItem sx={{ mx: 1 }} />
            <Typography color="text.secondary">
                {turnText}
            </Typography>

            <Divider flexItem sx={{ mx: 1 }} />
            <Typography color="text.secondary">
                {deckText}
            </Typography>
        </Stack>
    );
}