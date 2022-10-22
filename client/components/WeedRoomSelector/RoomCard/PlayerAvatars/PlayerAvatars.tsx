import { Stack } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { WeedRoom } from '../../../../../types/weed/WeedTypes';
import { toArray } from '../../../../../utils/Dict';
import { PlayerAvatar } from '../../../Shared/PlayerAvatar';

export type PlayerAvatarsProps = {
    room: WeedRoom;
};

export const PlayerAvatars: FunctionComponent<PlayerAvatarsProps> = (props) => {
    const players = toArray(props.room.players);
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
            </AnimatePresence>
        </Stack>
    )
}