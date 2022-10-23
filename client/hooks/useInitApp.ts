import { useEffect } from "react";
import { setIsLoading, setRooms } from "../redux/rooms/rooms";
import { GameService } from "../services/GameService";
import { useAppDispatch } from "./redux";

export const useInitApp = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            dispatch(setIsLoading(true));
            const roomsDict = await GameService.getCurrentRooms();
            dispatch(setIsLoading(false));
            dispatch(setRooms(roomsDict));
            GameService.attachToCurrentRooms((roomsDict) => {
                dispatch(setRooms(roomsDict));
            });
        })()
    }, []);
};
