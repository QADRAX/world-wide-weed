import _ from "lodash";
import { useEffect } from "react";
import { setHasPendingMessage } from "../redux/rooms/rooms";
import { useAppDispatch, useAppSelector } from "./redux";
import { usePrevious } from "./usePrevious";

export function useHasPendingMesseges() {
    const dispatch = useAppDispatch();
    const currentChatMessages = useAppSelector((state) => state.rooms.currentChatMessages);
    const previousChatMessages = usePrevious(currentChatMessages);

    useEffect(() => {
        const isEqual = _.isEqual(currentChatMessages, previousChatMessages);
        const hasPendingMessages = !isEqual && currentChatMessages && currentChatMessages.length > 0;
        if(hasPendingMessages) {
            dispatch(setHasPendingMessage(true));
        }

    }, [currentChatMessages, previousChatMessages]);
}