import React, { FunctionComponent } from 'react';
import { CardType } from '../../../../types/WeedTypes';
import { useCurrentMatchSnapshot } from '../../../hooks/usePlayerMatch';
import { WeedCard } from './WeedCard';
import { Stack, Typography } from '@mui/material';

export type WeedInfoItemProps = {
    cardType: CardType;
    count: number;
    text?: string;
};

export type InGameWeedInfoItemProps = {
    cardType: CardType;
    count: number;
}

export const InGameWeedInfoItem: FunctionComponent<InGameWeedInfoItemProps> = (props) => {
    const currentSnap = useCurrentMatchSnapshot();
    
    if(!currentSnap) return null;

    let discardsCount = 0;
    const discards = currentSnap.discards ?? [];
    discards.forEach((discard) => {
        if(discard.type === props.cardType) {
            discardsCount++;
        }
    });

    const text = `${discardsCount} /`;

    return (
        <WeedInfoItem cardType={props.cardType} count={props.count} text={text} />
    );
}

export const WeedInfoItem: FunctionComponent<WeedInfoItemProps> = (props) => {
    return (
        <Stack direction="row"
            justifyContent='center'
            spacing={1}
            sx={{
                alignItems: 'center',
            }} >
            <WeedCard cardType={props.cardType} width={40} />
            <Typography variant="body1"
                sx={{
                    cursor: 'default',
                }}>
                <b>{props.text} {props.count}</b>
            </Typography>
        </Stack>
    );
};
