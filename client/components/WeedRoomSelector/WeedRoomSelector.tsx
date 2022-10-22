import styled from '@emotion/styled';
import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ANIMATION_VERTICAL_FADE } from '../../config/animations';
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

            <Stack direction="row" alignItems="baseline" spacing={2} sx={{ p: 1 }}>
                <Typography variant="h5" component="div" sx={{ p: 1 }}>
                    WEED ROOMS
                </Typography>
            </Stack>


            <Divider sx={{ mb: 1 }}></Divider>

            <GridContainer container spacing={{ xs: 2, md: 2 }} columns={{ xs: 2, sm: 8, md: 12 }}>
                <AnimatePresence>
                    {rooms.map((r) => (
                        <Grid
                            key={r.id}
                            component={motion.div}
                            {...ANIMATION_VERTICAL_FADE}
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            sx={{ paddingRight: '16px' }} >
                            <RoomCard room={r} />
                        </Grid>
                    ))}
                </AnimatePresence>
            </GridContainer>

            <Divider sx={{ mb: 1, mt: 1 }}></Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems:'center', mb: 1 }}>
                {isRoomAdmin && <CreateRoomButton />}
            </Box>
        </MainContainer>
    )
};