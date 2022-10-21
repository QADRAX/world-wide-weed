import { Avatar, Badge, Stack, styled } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { WeedRoom } from '../../../../../types/weed/WeedTypes';
import { toArray } from '../../../../../utils/Dict';

export type PlayerAvatarsProps = {
    room: WeedRoom;
};

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

export const PlayerAvatars: FunctionComponent<PlayerAvatarsProps> = (props) => {
    const players = toArray(props.room.players);
    return (
        <Stack direction="row" spacing={1}>
            {
                players.map((player) => {
                    const idsDict = props.room.readyPlayersIds ?? {};
                    const readyPlayerIds = Object.keys(idsDict);
                    if (readyPlayerIds.includes(player.id)) {
                        return (
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt={player.name} src={player.avatarUrl} />
                            </StyledBadge>
                        );
                    } else {
                        return (
                            <Avatar alt={player.name} src={player.avatarUrl} />
                        );
                    }
                })
            }
        </Stack>
    )
}