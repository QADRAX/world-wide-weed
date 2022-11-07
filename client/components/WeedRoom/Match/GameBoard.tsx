import { Stack } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { useCurrentMatchSnapshot } from '../../../hooks/usePlayerMatch';
import { PlayerZone } from './PlayerZone';

export const GameBoard = () => {
    const currentSnapshot = useCurrentMatchSnapshot();
    const matchPlayers = useAppSelector((state) => state.match.players);
    return (
        <Stack direction="column" spacing={2} sx={{ py: 2}}>
            {matchPlayers.map((player) => {
                const playerSnap = currentSnapshot?.players.find((p) => p.playerId === player.id);

                if(!playerSnap) {
                    return null;
                }

                return (
                    <PlayerZone key={player.id} playerSnap={playerSnap} playerInfo={player} />
                );
            })}
        </Stack>
    );
};