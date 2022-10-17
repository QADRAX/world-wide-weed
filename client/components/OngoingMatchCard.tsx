import { Button, Paper } from "@mui/material";
import React, { FunctionComponent } from "react";
import { OngoingWeedMatch } from "../../types/weed/WeedTypes";
import { useAuth } from "../hooks/useAuth";

type OngoingMatchCardProps = {
    match: OngoingWeedMatch;
}

export const OngoingMatchCard: FunctionComponent<OngoingMatchCardProps> = (props) => {
    const { user } = useAuth();

    const isCreator = user?.uid == props.match.creator.id;
    const isInGame = props.match.onGoingPlayer.find((p) => p.player.id == user?.uid) != null;
    const isDisabled = isCreator || props.match.onGoingPlayer.length >= 8;

    return (
        <Paper>
            {
                isInGame 
                    ? <Button> Play </Button>
                    : <Button disabled={isDisabled}> JOIN </Button>
            }
            {props.match.name}
        </Paper>
    );
} 