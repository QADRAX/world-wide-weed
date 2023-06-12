import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import {
    useCurrentDeckSchema,
    useCurrentMatchSnapshot,
    useCurrentPlayer,
    useCurrentTurn,
    useIsCurrentPlayerTurn,
    useIsGameOver,
    useTotalTurns
} from '../../../hooks/usePlayerMatch';
import { WeedInfoButton } from './WeedInfoButton';

export const MatchInfo = () => {
    const currentTurn = useCurrentTurn();
    const totalTurns = useTotalTurns();
    const { currentPlayer } = useCurrentPlayer();
    const isCurrentPlayerTurn = useIsCurrentPlayerTurn();
    const currentSnap = useCurrentMatchSnapshot();
    const isGameOver = useIsGameOver();
    const deckSchema = useCurrentDeckSchema();

    const turnText = `Turn: ${currentTurn + 1}/${totalTurns}`;
    const playerText = isCurrentPlayerTurn ? `It's your turn` : `Turn of: ${currentPlayer?.name}`;
    const deckSize = currentSnap?.deckSize ?? 0;
    const deckText = `Deck size: ${deckSize}`;

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{
            position: 'relative',
            width: '100%',
        }}  >
            <Stack direction="row" alignItems="center">
                {
                    isGameOver
                        ? <Typography color="text.secondary">
                            GAME OVER
                        </Typography>
                        : <>
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
                        </>
                }

            </Stack>
            <WeedInfoButton deckSchema={deckSchema} inGame={true} />
        </Stack>
    );
}