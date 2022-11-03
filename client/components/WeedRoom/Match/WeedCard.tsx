import { Box, Card, Skeleton, styled } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { CardType, EmptyCardType } from '../../../../types/WeedTypes';
import { ANIMATION_SIMPLE_FADE } from '../../../config/animations';

const StyledCard = styled(Card)({
    display: 'grid',
    fontSize: '1.5rem',
})

export type WeedCardProps = {
    cardType: CardType | EmptyCardType;
    disabled?: boolean;
    selected?: boolean;
    highlighted?: boolean;
    onClick?: () => void;
}

const width = '50px';
const height = '75px';

export const WeedCard: FunctionComponent<WeedCardProps> = (props) => {

    const imageUrl = props.cardType != 'empty'
        ? `url(/cards/${props.cardType}.jpg)`
        : undefined;

    const cursor = props.cardType == 'empty'
        ? 'default'
        : props.disabled
            ? 'not-allowed'
            : 'pointer';

    return (
        <StyledCard
            className={props.selected ? 'selected' : ''}
            sx={{
                position: 'relative',
                cursor: cursor,
            }}
            elevation={3}
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
    );
}
