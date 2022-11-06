import { Badge, Box, Card, Skeleton, styled } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { CardType, EmptyCardType, ProtectableCardType } from '../../../../types/WeedTypes';
import { ANIMATION_SIMPLE_FADE } from '../../../config/animations';

const StyledCard = styled(Card)({
    display: 'grid',
    fontSize: '1.5rem',
})

export type WeedCardProps = {
    cardType: CardType | EmptyCardType;
    protectedValue?: ProtectableCardType | EmptyCardType;
    disabled?: boolean;
    selected?: 'hand' | 'target' | 'destination';
    onClick?: () => void;
}

const width = '50px';
const height = '75px';

const protectedValueWidth = '20px';
const protectedValueHeight = '30px';

export const WeedCard: FunctionComponent<WeedCardProps> = (props) => {

    const imageUrl = props.cardType != 'empty'
        ? `url(/cards/${props.cardType}.jpg)`
        : undefined;

    const protectedValueImageUrl = props.protectedValue != 'empty'
        ? `url(/cards/${props.protectedValue}.jpg)`
        : undefined;

    const cursor = props.cardType == 'empty'
        ? 'default'
        : props.disabled
            ? 'not-allowed'
            : 'pointer';

    let className = '';
    switch(props.selected) {
        case 'hand':
            className = 'selected selected-0';
            break;
        case 'target':
            className = 'selected selected-1';
            break;
        case 'destination':
            className = 'selected selected-2';
            break;
        default:
            className = '';
            break;
    }

    return (
        <Badge
            component={motion.div}
            {...ANIMATION_SIMPLE_FADE}
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            badgeContent={
                <>
                    {
                        props.protectedValue != 'empty' && props.protectedValue != undefined &&
                        <Card elevation={4}>
                            <Box sx={{
                                width: protectedValueWidth,
                                height: protectedValueHeight,
                                opacity: props.disabled ? 0.2 : 1,
                                transition: 'opacity 0.2s',
                                backgroundImage: protectedValueImageUrl,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                            }} />
                        </Card>
                    }
                </>
            }
        >
            <StyledCard
                className={className}
                sx={{
                    position: 'relative',
                    cursor: cursor,
                    border: '0.2rem solid transparent',
                }}
                elevation={3}
                onClick={props.onClick}
            >
                <AnimatePresence>
                    {
                        props.disabled && (
                            <Skeleton
                                component={motion.div}
                                {...ANIMATION_SIMPLE_FADE}
                                color="primary"
                                sx={{
                                    position: 'absolute',
                                    width,
                                    height,
                                }}
                            >
                            </Skeleton>
                        )
                    }
                </AnimatePresence>
                <Box sx={{
                    position: 'relative',
                    width,
                    height,
                    backgroundImage: imageUrl,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    opacity: props.disabled ? 0.2 : 1,
                    transition: 'opacity 0.2s',
                }} />
            </StyledCard >
        </Badge>
    );
}
