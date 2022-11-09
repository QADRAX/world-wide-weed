import { useEffect } from "react";
import { setChatMessages } from "../redux/rooms/rooms";
import { GameService } from "../services/GameService";
import { useAppDispatch } from "./redux";
import { usePlayerRoom } from "./usePlayerRoom";

export function useInitRoom(){
    const dispatch = useAppDispatch();
    const currentRoom = usePlayerRoom();

    useEffect(() => {
        let unsubscribeChat: (() => void) | undefined = undefined;
        if (currentRoom) {
            unsubscribeChat = GameService.subscribeToChat(currentRoom.id, (chat) => {
                dispatch(setChatMessages(chat));
            });
        }
        return () => {
            dispatch(setChatMessages([]));
            if (unsubscribeChat) {
                unsubscribeChat();
            }
        };
    }, [currentRoom]);
}
