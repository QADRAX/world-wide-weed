import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";
import { MAX_PLAYERS_IN_MATCH, MIN_PLAYERS_IN_MATCH } from "../../../../shared/constants";
import { WeedRoom } from "../../../../types/weed/WeedTypes";
import { toArray } from "../../../../utils/Dict";
import { useAppDispatch } from "../../../hooks/redux";
import { useIsRoomAdmin } from "../../../hooks/useAuth";
import { setIsLoading } from "../../../redux/rooms/rooms";
import { GameService } from "../../../services/GameService";
import { PlayerAvatars } from "./PlayerAvatars/PlayerAvatars";

type RoomCardProps = {
    room: WeedRoom;
}

export const RoomCard: FunctionComponent<RoomCardProps> = (props) => {
    const isRoomAdmin = useIsRoomAdmin();
    const dispatch = useAppDispatch();

    const players = toArray(props.room.players);
    const numberOfPlayers = players.length;

    const roomState = numberOfPlayers < MIN_PLAYERS_IN_MATCH
        ? numberOfPlayers === 0
            ? "Empty room"
            : "Waiting for players"
        : props.room.isStarted
            ? "Game in progress"
            : numberOfPlayers == MAX_PLAYERS_IN_MATCH
                ? "Full room"
                : "Ready to start";

    const joinRoom = async () => {
        dispatch(setIsLoading(true));
        await GameService.joinRoom({
            roomId: props.room.id,
        });
        dispatch(setIsLoading(false));
    };

    const deleteRoom = async () => {
        dispatch(setIsLoading(true));
        await GameService.deleteRoom({
            roomId: props.room.id,
        });
        dispatch(setIsLoading(false));
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {props.room.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {roomState}
                </Typography>
                <PlayerAvatars room={props.room} />
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={joinRoom}>Join</Button>
                {isRoomAdmin && <Button size="small" color="error" onClick={deleteRoom}>Delete</Button>}
            </CardActions>
        </Card>
    );
} 