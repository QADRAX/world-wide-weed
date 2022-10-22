import { Box, Skeleton, Stack, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { WeedPlayer } from '../../../../types/Player';
import { PlayerAvatar } from '../../Shared/PlayerAvatar';
import { motion } from "framer-motion";
import { ANIMATION_VERTICAL_FADE } from '../../../config/animations';

const SIZE = 40;

export type RoomPlayerEntryProps = {
    player: WeedPlayer;
    readyPlayersIds: string[];
}

export const RoomPlayerEntry: FunctionComponent<RoomPlayerEntryProps> = (props) => {
    const { player, readyPlayersIds } = props;
    const isReady = readyPlayersIds.includes(player.id);

    return (
        <Box component={motion.div} {...ANIMATION_VERTICAL_FADE}>
            <Stack direction="row" justifyItems="flex-start" alignItems="center" spacing={2}>
                <PlayerAvatar player={player} isReady={isReady} size={SIZE} />
                <Typography>{player.name}</Typography>
            </Stack>
        </Box>
    )
};

export type RoomPlayerEntrySkeletonProps = {
    accent?: boolean;
}

export const EmptyRoomPlayerEntry: FunctionComponent<RoomPlayerEntrySkeletonProps> = (props) => {
    const { accent } = props;
    const bgColor = accent ? 'grey.400' : 'grey.300';
    return (
        <Box component={motion.div} {...ANIMATION_VERTICAL_FADE}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Skeleton variant="circular" width={SIZE} height={SIZE} animation="wave" sx={{ bgcolor: bgColor }} />
                <Typography><Skeleton animation="wave" width={150} sx={{ bgcolor: bgColor }} /></Typography>
            </Stack>
        </Box>
    )
}