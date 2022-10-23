import { Stack } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { MAX_PLAYERS_IN_MATCH } from '../../../../../shared/constants';
import { WeedRoom } from '../../../../../types/weed/WeedTypes';
import { toArray } from '../../../../../utils/Dict';
import { PlayerAvatar } from '../../../Shared/PlayerAvatar';

export type PlayerAvatarsProps = {
    room: WeedRoom;
};

export const PlayerAvatars: FunctionComponent<PlayerAvatarsProps> = (props) => {
    const players = toArray(props.room.players);
    const playersLeftToStart = MAX_PLAYERS_IN_MATCH - players.length;

    return (
        <Stack direction="row" spacing={1}>
            <AnimatePresence>
                {
                    players.map((player) => {
                        const idsDict = props.room.readyPlayersIds ?? {};
                        const readyPlayerIds = toArray(idsDict);
                        const isReady = readyPlayerIds.includes(player.id);
                        return <PlayerAvatar key={player.id} player={player} isReady={isReady} />
                    })
                }

                {
                    playersLeftToStart > 0 && Array(playersLeftToStart).fill(0).map((_, index) => {
                        return <PlayerAvatar key={index} />
                    })
                }
            </AnimatePresence>
        </Stack>
    )
}