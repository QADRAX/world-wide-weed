import { Box, Card, Skeleton } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { CardType, EmptyCardType } from '../../../../types/WeedTypes';
import { ANIMATION_HORIZONTAL_FADE, ANIMATION_SIMPLE_FADE } from '../../../config/animations';

export type WeedCardProps = {
    cardType: CardType | EmptyCardType;
    disabled?: boolean;
}

const width = '60px';
const height = '90px';

export const WeedCard: FunctionComponent<WeedCardProps> = (props) => {
    const [shadow, setShadow] = React.useState(3);

    const imageUrl = props.cardType != 'empty'
        ? `url(/cards/${props.cardType}.jpg)`
        : undefined;

    const onMouseOver = () => setShadow(8);
    const onMouseOut = () => setShadow(3);

    return (
        <Card
            component={motion.div} 
            {...ANIMATION_HORIZONTAL_FADE}
            sx={{
                position: 'relative',
            }}
            elevation={shadow}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            <AnimatePresence>
                {
                    props.disabled && (
                        <Skeleton
                            component={motion.div}
                            {...ANIMATION_SIMPLE_FADE}
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
        </Card >
    );
}
