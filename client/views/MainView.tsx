import React, { FunctionComponent } from "react";
import { WeedRoom } from "../components/WeedRoom/WeedRoom";
import { WeedRoomSelector } from "../components/WeedRoomSelector/WeedRoomSelector";
import { useInitApp } from "../hooks/useInitApp";
import { usePlayerRoom } from "../redux/getters";

export const MainView: FunctionComponent = () => {
    useInitApp();
    const currentRoom = usePlayerRoom();

    if (currentRoom) {
        return <WeedRoom />;
    } else {
        return <WeedRoomSelector />;
    }
}