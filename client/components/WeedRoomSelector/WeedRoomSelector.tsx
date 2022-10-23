import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { useIsRoomAdmin } from '../../hooks/useAuth';
import { useCurrentRooms } from '../../redux/getters';
import { MainCard } from '../Shared/MainCard';
import { CreateRoomButton } from './CreateRoomButton.tsx/CreateRoomButton';
import { RoomCard } from './RoomCard/RoomCard';

export const WeedRoomSelector = () => {
    const rooms = useCurrentRooms();
    const isRoomAdmin = useIsRoomAdmin()

    return (
        <MainCard
            title={
                <Typography variant="h5" component="div" sx={{ p: 1 }}>
                    WEED ROOMS
                </Typography>
            }
            footer={
                <>
                    {isRoomAdmin && <CreateRoomButton />}
                </>
            }
        >
            <AnimatePresence>
                <Stack direction="column" spacing={1} sx={{ p: 1}}>
                    {rooms.map((r) => (
                        <RoomCard key={r.id} room={r} />
                    ))}
                </Stack>
            </AnimatePresence>
        </MainCard>
    );
};