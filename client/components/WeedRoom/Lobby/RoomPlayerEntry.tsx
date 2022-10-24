import { Box, Skeleton, Stack, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { WeedPlayer } from '../../../../types/Player';
import { PlayerAvatar } from '../../Shared/PlayerAvatar';
import { motion } from "framer-motion";
import { ANIMATION_VERTICAL_FADE } from '../../../config/animations';

const SIZE = 40;

export type RoomPlayerEntryProps = {
    player?: WeedPlayer;
    readyPlayersIds?: string[];
    accent?: boolean;
}

export const RoomPlayerEntry: FunctionComponent<RoomPlayerEntryProps> = (props) => {
    const { player } = props;

    const readyPlayerIds = props.readyPlayersIds ?? [];
    const isReady = player ? readyPlayerIds.includes(player.id) : false;
    const bgColor = props.accent ? 'grey.400' : 'grey.300';

    return (
        <Box component={motion.div} {...ANIMATION_VERTICAL_FADE}>
            <Stack direction="row" justifyItems="flex-start" alignItems="center" spacing={2}>
                <PlayerAvatar player={player} isReady={isReady} size={SIZE} />
                <Typography>
                    {
                        player 
                            ? player.name
                            : <Skeleton animation="wave" width={150} sx={{ bgcolor: bgColor }} />
                    }
                </Typography>
            </Stack>
        </Box>
    )
};