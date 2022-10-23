import React, { FunctionComponent } from "react";
import { LoaderContainer } from "../components/LoaderContainer";
import { WeedRoom } from "../components/WeedRoom/WeedRoom";
import { WeedRoomSelector } from "../components/WeedRoomSelector/WeedRoomSelector";
import { useAppSelector } from "../hooks/redux";
import { useInitApp } from "../hooks/useInitApp";
import { usePlayerRoom } from "../redux/getters";

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