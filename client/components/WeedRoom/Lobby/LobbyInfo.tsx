import { Typography } from '@mui/material';
import React from 'react';
import { getRoomStatusText } from '../../../../shared/weedUtils';
import { useCurrentPlayerRoom } from '../../../hooks/usePlayerRoom';

export const LobbyInfo = () => {
    const currentRoom = useCurrentPlayerRoom();
    const roomStatusText = getRoomStatusText(currentRoom);
    
    return (
        <>
            <Typography variant="h5" component="div" sx={{ p: 1 }}>
                {currentRoom.name}
            </Typography>
            <Typography color="text.secondary">
                {roomStatusText}
            </Typography>
        </>
    )
}