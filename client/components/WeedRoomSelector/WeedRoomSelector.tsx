import styled from '@emotion/styled';
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { useIsRoomAdmin } from '../../hooks/useAuth';
import { useCurrentRooms } from '../../redux/getters';
import { CreateRoomButton } from './CreateRoomButton.tsx/CreateRoomButton';
import { RoomCard } from './RoomCard/RoomCard';

const MainContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
});

const GridContainer = styled(Grid)({
    flex: 1,
    overflow: 'auto',
});


export const WeedRoomSelector = () => {
    const rooms = useCurrentRooms();
    const isRoomAdmin = useIsRoomAdmin()

    return (
        <MainContainer maxWidth={false}>
            <Typography variant="h5" component="div" sx={{ padding: '16px', marginBottom: '16px' }}>
                WEED ROOMS
            </Typography>
            <GridContainer container spacing={{ xs: 2, md: 2 }} columns={{ xs: 2, sm: 8, md: 12 }}>
                {rooms.length == 0 && (
                    <Grid item xs={12} sm={12} md={12}>
                        <Skeleton animation='wave' />
                    </Grid>
                )}

                {rooms.map((r) => (
                    <Grid item xs={12} sm={12} md={12} sx={{ paddingRight: '16px' }} key={r.id}>
                        <RoomCard key={r.id} room={r} />
                    </Grid>
                ))}
            </GridContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                {isRoomAdmin && <CreateRoomButton />}
            </Box>
        </MainContainer>
    )
};