import { useEffect } from "react";
import { setChatMessages, setHasPendingMessage } from "../redux/rooms/rooms";
import { GameService } from "../services/GameService";
import { useAppDispatch } from "./redux";
import { usePlayerRoom } from "./usePlayerRoom";

export function useInitRoom() {
    const dispatch = useAppDispatch();
    const currentRoom = usePlayerRoom();

    useEffect(() => {
        let unsubscribeChat: (() => void) | undefined = undefined;
        if (currentRoom) {
            unsubscribeChat = GameService.subscribeToChat(currentRoom.id, (chat) => {
                dispatch(setChatMessages(chat));
                if (chat != null) {
                    dispatch(setHasPendingMessage(true));
                }
            });
        }
        return () => {
            dispatch(setChatMessages([]));
            dispatch(setHasPendingMessage(false));
            if (unsubscribeChat) {
                unsubscribeChat();
            }
        };
    }, [currentRoom]);
}
