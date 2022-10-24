import { useEffect } from "react";
import { setIsLoading, setRooms } from "../redux/rooms/rooms";
import { GameService } from "../services/GameService";
import { useAppDispatch } from "./redux";

export const useInitApp = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined = undefined;

        (async () => {
            dispatch(setIsLoading(true));
            const roomsDict = await GameService.getCurrentRooms();
            dispatch(setIsLoading(false));
            dispatch(setRooms(roomsDict));
            unsubscribe = GameService.subscribeToCurrentRooms((roomsDict) => {
                dispatch(setRooms(roomsDict));
            });
        })();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [dispatch]);
};
