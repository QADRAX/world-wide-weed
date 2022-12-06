import { Stack, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { getFieldValue } from '../../../../shared/gameLogic';
import { WeedPlayer } from '../../../../types/Player';
import { PublicMatchPlayer } from '../../../../types/WeedTypes';
import { useAuthenticatedUser } from '../../../hooks/useAuth';
import { useCurrentPlayer } from '../../../hooks/usePlayerMatch';
import { MatchPlayerAvatar, MatchPlayerAvatarState } from '../../Shared/PlayerAvatar';
import { PlayerField } from './PlayerField';

export type PlayerZoneProps = {
    playerSnap: PublicMatchPlayer;
    playerInfo: WeedPlayer;
};

export const PlayerZone: FunctionComponent<PlayerZoneProps> = (props) => {
    const { currentPlayer, isBriked } = useCurrentPlayer();
    const { user } = useAuthenticatedUser();

    if (currentPlayer == null) {
        return null;
    }

    const state: MatchPlayerAvatarState = currentPlayer.id == props.playerInfo.id
        ? isBriked
            ? 'briked'
            : 'playerTurn'
        : 'none';

    const virtualScore = props.playerSnap.fields.reduce(
        (acc, field) => field.protectedValue == 'busted'
            ? acc
            : acc + getFieldValue(field.value),
        0
    ) + props.playerSnap.smokedScore;

    const isCurrentPlayer = user.id == props.playerInfo.id;

    return (
        <Stack direction="column" spacing={2} justifyContent="center" alignContent="center">
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <MatchPlayerAvatar state={state} player={props.playerInfo} />
                <Typography variant="h6"
                    sx={{
                        textDecoration: isCurrentPlayer ? 'underline' : 'none',
                        cursor: 'default',
                    }}>
                    {props.playerInfo.name}
                </Typography>

                <Typography variant="caption"
                    sx={{
                        cursor: 'default',
                    }}>
                    Hand: {props.playerSnap.handSize}
                </Typography>

                <Typography variant="caption"
                    sx={{
                        cursor: 'default',
                    }}>
                    Score: {props.playerSnap.smokedScore} ({virtualScore})
                </Typography>
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" alignContent="center">
                {
                    props.playerSnap.fields.map((field) => (
                        <PlayerField key={field.id} player={props.playerInfo} field={field} />
                    ))
                }
            </Stack>
        </Stack>
    );
};