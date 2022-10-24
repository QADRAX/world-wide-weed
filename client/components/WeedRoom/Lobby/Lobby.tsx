import { Container, Stack, styled } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { MAX_PLAYERS_IN_MATCH } from '../../../../shared/constants';
import { toArray } from '../../../../utils/Dict';
import { useCurrentPlayerRoom } from '../../../hooks/usePlayerRoom';
import { RoomPlayerEntry } from './RoomPlayerEntry';

const MainContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
});

export const Lobby = () => {
    const currentRoom = useCurrentPlayerRoom();
    const players = toArray(currentRoom.players);
    const readyPlayersIds = toArray(currentRoom.readyPlayersIds ?? {});

    const playersLeftToStart = MAX_PLAYERS_IN_MATCH - players.length;

    return (
        <MainContainer>
            <Stack direction="column" spacing={2} sx={{ p: 1 }}>
                <AnimatePresence>
                    {
                        players.map((player) => {
                            return <RoomPlayerEntry key={player.id}
                                player={player}
                                readyPlayersIds={readyPlayersIds} />
                        })
                    }

                    {
                        playersLeftToStart > 0 && Array(playersLeftToStart).fill(0).map((_, index) => {
                            return <RoomPlayerEntry key={index} />
                        })
                    }
                </AnimatePresence>
            </Stack>
        </MainContainer>
    )
};
