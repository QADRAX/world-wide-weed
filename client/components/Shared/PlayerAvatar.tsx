import { Avatar, Badge, Skeleton, styled } from '@mui/material';
import { motion } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { WeedPlayer } from '../../../types/Player';
import { ANIMATION_HORIZONTAL_FADE } from '../../config/animations';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

export type PlayerAvatarsProps = {
    player?: WeedPlayer;
    isReady?: boolean;
    size?: number;
    accent?: boolean;
}

export const PlayerAvatar: FunctionComponent<PlayerAvatarsProps> = (props) => {
    const { player, isReady, accent } = props;

    const size = props.size ?? 40;
    const bgColor = accent ? 'grey.400' : 'grey.300';
    const sx = { width: size, height: size };
    if (!player) {
        return (
                <Skeleton component={motion.div} {...ANIMATION_HORIZONTAL_FADE} variant="circular" width={size} height={size} animation="wave" sx={{ bgcolor: bgColor }} />
        )
    } else if (isReady) {
        return (
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar component={motion.div} {...ANIMATION_HORIZONTAL_FADE} sx={sx} alt={player.name} src={player.avatarUrl} />
            </StyledBadge>
        );
    } else {
        return (
            <Avatar component={motion.div} {...ANIMATION_HORIZONTAL_FADE} sx={sx} alt={player.name} src={player.avatarUrl} />
        );
    }
}