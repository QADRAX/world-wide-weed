import { Container, Divider, IconButton, Paper, Stack, styled } from '@mui/material';
import React, { FunctionComponent, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ANIMATION_DRAWER_OVERLAY } from '../../config/animations';

const MainContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingRight: '0px!important',
    paddingLeft: '0px!important',
});

const BodyContainer = styled('div')({
    position: 'relative',
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    '&.drawer-open': {
        overflowY: 'hidden',
    },
});

const OverlayToggle = styled('div')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.07,
});

const OverlayContainer = styled(motion.div)({
    position: 'absolute',
    width: '80%',
    height: '100%',
    right: 0,
    zIndex: 90,
});

const OverlayContent = styled(Paper)({
    position: 'relative',
    height: '100%',
    width: '100%',
    borderRadius: 0,
});

export type MainCardProps = {
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    innerContent?: React.ReactNode;
    expandIcon?: React.ReactNode;
};

export const MainCard: FunctionComponent<MainCardProps> = (props) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const toggleDrawer = () => setOpen(!open);

    return (
        <MainContainer maxWidth={false}>
            <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={2} sx={{ p: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
                    {props.title}
                </Stack>
                <IconButton onClick={toggleDrawer}>
                    {props.expandIcon}

                </IconButton>
            </Stack>

            <Divider></Divider>

            <BodyContainer ref={containerRef} className={open ? 'drawer-open' : ''}>
                <AnimatePresence>
                    {open && (
                        <>
                            <OverlayContainer key={'container'}
                                {...ANIMATION_DRAWER_OVERLAY}>
                                <OverlayContent elevation={6}>
                                    {props.innerContent}
                                </OverlayContent>
                            </OverlayContainer>
                            <motion.div
                                key={'overlay'}
                                {...ANIMATION_DRAWER_OVERLAY}>
                                <OverlayToggle
                                    onClick={toggleDrawer}>
                                </OverlayToggle>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                {props.children}
            </BodyContainer>

            {
                props.footer && (
                    <>
                        <Divider sx={{ mb: 1 }}></Divider>
                        <Stack direction="column" spacing={1} justifyContent="center" alignItems='center' sx={{ mb: 1 }}>
                            {props.footer}
                        </Stack>
                    </>
                )
            }
        </MainContainer>
    );
};