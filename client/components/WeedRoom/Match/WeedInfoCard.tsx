import React, { FunctionComponent } from 'react';
import { CardType } from '../../../../types/WeedTypes';
import { useCurrentMatchSnapshot } from '../../../hooks/usePlayerMatch';
import { WeedCard } from './WeedCard';
import { Stack, Typography } from '@mui/material';

export type WeedInfoCardProps = {
    cardType: CardType;
    count: number;
};

export const WeedInfoCard: FunctionComponent<WeedInfoCardProps> = (props) => {
    const currentSnap = useCurrentMatchSnapshot();
    
    if(!currentSnap) return null;

    let discardsCount = 0;
    const discards = currentSnap.discards ?? [];
    discards.forEach((discard) => {
        if(discard.type === props.cardType) {
            discardsCount++;
        }
    });

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
                <b>{discardsCount} / {props.count}</b>
            </Typography>
        </Stack>
    );
};