import React, { FunctionComponent } from 'react';
import { CardType } from '../../../../types/WeedTypes';

export type WeedCardProps = {
    cardType: CardType;
}

export const WeedCard: FunctionComponent<WeedCardProps> = (props) => {
    const imageUrl = `/cards/${props.cardType}.jpg`;

    return (
            <img src={imageUrl}>

            </img>
    );
}

