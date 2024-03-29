import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { FunctionComponent } from "react";
import { getRoomStatusText } from "../../../../shared/weedUtils";
import { WeedRoom } from "../../../../types/WeedTypes";
import { ANIMATION_VERTICAL_FADE } from "../../../config/animations";
import { useAppDispatch } from "../../../hooks/redux";
import { useIsRoomAdmin } from "../../../hooks/useAuth";
import { setIsLoading } from "../../../redux/rooms/rooms";
import { GameService } from "../../../services/GameService";
import { PlayerAvatars } from "./PlayerAvatars/PlayerAvatars";
import { WeedInfoButton } from "../../WeedRoom/Match/WeedInfoButton";

type RoomCardProps = {
    room: WeedRoom;
}

export const RoomCard: FunctionComponent<RoomCardProps> = (props) => {
    const isRoomAdmin = useIsRoomAdmin();
    const dispatch = useAppDispatch();

    const roomStatusText = getRoomStatusText(props.room);
    const isRoomStarted = props.room.matchId != null;

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

    const restartRoom = async () => {
        dispatch(setIsLoading(true));
        await GameService.restartRoom({
            roomId: props.room.id,
        });
        dispatch(setIsLoading(false));
    };

    return (
        <Card component={motion.div}
            {...ANIMATION_VERTICAL_FADE}
            sx={{ backgroundColor: '#e9fff4' }}
            elevation={2}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                
                    <Typography variant="h5" component="div">
                        {props.room.name}
                    </Typography>
                    <WeedInfoButton deckSchema={props.room.deckSchema} inGame={false} />
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {roomStatusText}
                    </Typography>
                    
                </Stack>
                <PlayerAvatars room={props.room} />
            </CardContent>
            <CardActions>
                <Button size="small"
                    color="primary"
                    disabled={isRoomStarted}
                    onClick={joinRoom}>
                    Join
                </Button>
                {isRoomAdmin && <Button size="small" color="error" onClick={deleteRoom}>Delete</Button>}
                {isRoomAdmin && <Button size="small" color="warning" onClick={restartRoom}>Restart</Button>}
            </CardActions>
        </Card>
    );
} 