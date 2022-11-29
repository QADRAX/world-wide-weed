import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { LastMatch } from '../../../redux/lastMatch/lastMatch';
import { MatchPlayerAvatar } from '../PlayerAvatar';
import { getMatchInfo } from './LastMatch.helpers';

export type LastMatchInfoProps = {
    match?: LastMatch;
}

export const LastMatchInfo: FunctionComponent<LastMatchInfoProps> = (props) => {
    if (props.match == null) {
        return null;
    }

    const weedInfoPlayers = getMatchInfo(props.match);

    return (
        <List>
            {weedInfoPlayers.map((infoPlayer, index) => {

                const state = infoPlayer.isWinner
                    ? 'winner'
                    : infoPlayer.isLoser
                        ? 'briked'
                        : 'none';

                const primaryText = `${infoPlayer.weedPlayer.name} ${infoPlayer.isWinner ? '(Winner)' : ''} ${infoPlayer.isLoser ? '(Loser)' : ''}`;
                const secondaryText = `Score: ${infoPlayer.points}`;

                return (

                    <ListItem key={index}>
                        <ListItemAvatar>
                            <MatchPlayerAvatar player={infoPlayer.weedPlayer} state={state} />
                        </ListItemAvatar>
                        <ListItemText primary={primaryText} secondary={secondaryText} />
                    </ListItem>
                )
            })}
        </List>
    )
}