import { Button, Paper } from "@mui/material";
import React, { FunctionComponent } from "react";
import { OngoingWeedMatch } from "../../types/weed/WeedTypes";
import { useAuthenticatedUser } from "../hooks/useAuth";

type OngoingMatchCardProps = {
    match: OngoingWeedMatch;
}

export const OngoingMatchCard: FunctionComponent<OngoingMatchCardProps> = (props) => {
    const { user } = useAuthenticatedUser();

    const isCreator = user.id == props.match.creator.id;
    const isInGame = props.match.onGoingPlayer.find((p) => p.player.id == user.id) != null;
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