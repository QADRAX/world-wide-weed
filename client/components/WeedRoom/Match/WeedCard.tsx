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
    hidden?: boolean;
    selected?: 'hand' | 'target' | 'destination';
    width?: number;
    onClick?: () => void;
}

const DEFAULT_SIZE_RATIO = 1.5;
const DEFAULT_WIDTH = 45;
const DEFUALT_PROTECTED_ASPECT_RATIO = 0.4;

export const WeedCard: FunctionComponent<WeedCardProps> = (props) => {
    const width = props.width || DEFAULT_WIDTH;
    const height = width * DEFAULT_SIZE_RATIO;
    const protectedValueWidth = width * DEFUALT_PROTECTED_ASPECT_RATIO;

    const cardOpacity = props.hidden 
            ? 0
            : props.disabled
                ? 0.2
                : 1;

    const cardOpacity = props.hidden 
            ? 0
            : props.disabled
                ? 0.2
                : 1;

    const widthCss = `${width}px`;
    const heightCss = `${height}px`;

    const imageUrl = props.cardType != 'empty'
        ? `url(/cards/${props.cardType}.jpg)`
        : undefined;

    const cursor = props.cardType == 'empty'
        ? 'default'
        : props.disabled
            ? 'not-allowed'
            : 'pointer';

    let className = '';
    switch (props.selected) {
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
                        <WeedCard cardType={props.protectedValue} width={protectedValueWidth} onClick={props.onClick} />
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
                        (props.disabled || props.hidden) && (
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
                    width: widthCss,
                    height: heightCss,
                    backgroundImage: imageUrl,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    opacity: cardOpacity,
                    transition: 'opacity 0.2s',
                }} />
            </StyledCard >
        </Badge>
    );
}
