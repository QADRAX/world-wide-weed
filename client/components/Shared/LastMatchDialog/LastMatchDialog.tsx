import { AppBar, Dialog, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { Transition } from './LastMatchDialog.transition';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setLastMatch } from '../../../redux/lastMatch/lastMatch';
import { LastMatchInfo } from './LastMatchInfo';
import { resetMatch } from '../../../redux/match/match';

export const LastMatchDialog = () => {
    const dispatch = useAppDispatch();
    const lastMatch = useAppSelector(state => state.lastMatch.lastMatch);
    const isOpen = useMemo(() => lastMatch != null, [lastMatch]);

    const handleClose = () => {
        dispatch(setLastMatch(undefined));
        dispatch(resetMatch());
    }

    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Game Over
                    </Typography>
                </Toolbar>
            </AppBar>
            <LastMatchInfo match={lastMatch} />
        </Dialog>
    )
}