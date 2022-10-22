import { Button, Card, CardActions, CardContent, styled, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";
import { getRoomStatusText } from "../../../../shared/weedUtils";
import { WeedRoom } from "../../../../types/weed/WeedTypes";
import { useAppDispatch } from "../../../hooks/redux";
import { useIsRoomAdmin } from "../../../hooks/useAuth";
import { setIsLoading } from "../../../redux/rooms/rooms";
import { GameService } from "../../../services/GameService";
import { PlayerAvatars } from "./PlayerAvatars/PlayerAvatars";

type RoomCardProps = {
    room: WeedRoom;
}

const RoomCardRoot = styled(Card)(({
    backgroundColor: '#e9fff4',
}));


export const RoomCard: FunctionComponent<RoomCardProps> = (props) => {
    const isRoomAdmin = useIsRoomAdmin();
    const dispatch = useAppDispatch();

    const roomStatusText = getRoomStatusText(props.room);

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
        <RoomCardRoot elevation={2}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {props.room.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {roomStatusText}
                </Typography>
                <PlayerAvatars room={props.room} />
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={joinRoom}>Join</Button>
                {isRoomAdmin && <Button size="small" color="error" onClick={deleteRoom}>Delete</Button>}
            </CardActions>
        </RoomCardRoot>
    );
} 