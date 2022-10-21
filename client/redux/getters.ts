import { useAppSelector } from "../hooks/redux";
import { useAuthenticatedUser } from "../hooks/useAuth";

export const useCurrentRooms = () => {
    const roomsDict = useAppSelector((state) => state.rooms.currentRooms);
    const rooms = Object.values(roomsDict ?? {});

    const sortedRooms = rooms.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return sortedRooms;
}

export const useCurrentPlayerRoom = () => {
    const { user } = useAuthenticatedUser();
    const rooms = useCurrentRooms();

    const playerRoom = rooms.find((r) => r.players?.find(((p) => p.id == user.id)) != null);

    return playerRoom;
}