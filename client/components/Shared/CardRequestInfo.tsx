import { Stack, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { WeedPlayer } from '../../../types/Player';
import { CardRequest, isPlayCardRequest } from '../../../types/WeedTypes';
import { WeedCard } from '../WeedRoom/Match/WeedCard';

export type CardRequestInfoProps = {
    cardRequest: CardRequest;
    players: WeedPlayer[];
}

export const CardRequestInfo: FunctionComponent<CardRequestInfoProps> = (props) => {
    const { cardRequest, players } = props;

    const lastPlayer = players.find((p) => p.id === cardRequest.playerId);

    if(!lastPlayer) {
        return null;
    }

    let playerInfoText = '';
    let targetInfoText = '';

    if (isPlayCardRequest(cardRequest)) {

        const lastTargetPlayer = players.find((p) => p.id === cardRequest.targetPlayerId);
        if (!lastTargetPlayer) {
            return null;
        }

        playerInfoText = `${lastPlayer.name} played`;

        if(lastTargetPlayer.id === lastPlayer.id) {
            targetInfoText = `against himself`;
        } else {
            targetInfoText = `against ${lastTargetPlayer.name}`;
        }
        

    } else {
        playerInfoText = `${lastPlayer.name} discarded`;
    }


    
    return (
        <Stack direction="row"
            justifyContent='center'
            spacing={1}
            sx={{
                alignItems: 'center',
            }} >
            <Typography variant="caption"
                sx={{
                    cursor: 'default',
                }}>
                {playerInfoText}
            </Typography>
            <WeedCard cardType={cardRequest.cardType} width={20} height={30} />
            <Typography variant="caption"
                sx={{
                    cursor: 'default',
                }}>
                {targetInfoText}
            </Typography>
        </Stack>
    )
}