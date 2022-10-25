import { Stack, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { getFieldValue } from '../../../../server/game/fields';
import { WeedPlayer } from '../../../../types/Player';
import { PublicMatchPlayer } from '../../../../types/WeedTypes';
import { useCurrentPlayer } from '../../../hooks/usePlayerMatch';
import { MatchPlayerAvatar, MatchPlayerAvatarState } from '../../Shared/PlayerAvatar';
import { WeedCard } from './WeedCard';

export type PlayerZoneProps = {
    playerSnap: PublicMatchPlayer;
    playerInfo: WeedPlayer;
};

export const PlayerZone: FunctionComponent<PlayerZoneProps> = (props) => {
    const { currentPlayer, isBriked } = useCurrentPlayer();

    if(currentPlayer == null) {
        return null;
    }

    const state: MatchPlayerAvatarState = currentPlayer.id == props.playerInfo.id 
        ? isBriked
            ? 'briked'
            : 'playerTurn'
        : 'none';

    const virtualScore = props.playerSnap.fields.reduce((acc, field) => acc + getFieldValue(field.value), 0) + props.playerSnap.smokedScore;

    return (
        <Stack direction="column" spacing={2} justifyContent="center" alignContent="center">
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <MatchPlayerAvatar state={state} player={props.playerInfo} />
                <Typography variant="h6">
                    {props.playerInfo.name}
                </Typography>
                <Typography variant="caption">
                    Score: {props.playerSnap.smokedScore} ({virtualScore})
                </Typography>
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" alignContent="center">
                {
                props.playerSnap.fields.map((field) => (
                    <WeedCard key={field.id} cardType={field.value} />
                ))
                }
            </Stack>
        </Stack>
    );
};