import { useEffect } from "react";
import { setRooms } from "../redux/rooms/rooms";
import { GameService } from "../services/GameService";
import { useAppDispatch } from "./redux";

export const useInitApp = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            const roomsDict = await GameService.getCurrentRooms();
            dispatch(setRooms(roomsDict));
            GameService.attachToCurrentRooms((roomsDict) => {
                dispatch(setRooms(roomsDict));
            });
        })()
    }, []);
};
