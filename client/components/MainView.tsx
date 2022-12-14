import React, { FunctionComponent } from "react";
import { LoaderContainer } from "./Shared/LoaderContainer";
import { WeedRoom } from "./WeedRoom";
import { WeedRoomSelector } from "./WeedRoomSelector";
import { useAppSelector } from "../hooks/redux";
import { useInitApp } from "../hooks/useInitApp";
import { usePlayerRoom } from "../hooks/usePlayerRoom";

export const MainView: FunctionComponent = () => {
    useInitApp();
    const isLoading = useAppSelector((state) => state.rooms.isLoading);
    const currentRoom = usePlayerRoom();

    if (isLoading && !currentRoom) {
        return <LoaderContainer />
    } else if (currentRoom) {
        return <WeedRoom />;
    } else {
        return <WeedRoomSelector />;
    }
}