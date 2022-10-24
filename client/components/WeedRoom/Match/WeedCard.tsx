import React, { FunctionComponent } from 'react';
import { CardType } from '../../../../types/WeedTypes';
import { Card, CardMedia } from '@mui/material';

export type WeedCardProps = {
    cardType: CardType;
}

export const WeedCard: FunctionComponent<WeedCardProps> = (props) => {
    const imageUrl = `/cards/${props.cardType}.jpg`;

    return (
        <Card elevation={3}>
            <CardMedia src={imageUrl}>

            </CardMedia>
        </Card>

    );
}

