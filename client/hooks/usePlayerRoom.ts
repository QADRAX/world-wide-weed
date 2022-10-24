import { toArray } from "../../utils/Dict";
import { useAppSelector } from "./redux";
import { useAuthenticatedUser } from "./useAuth";

export const useCurrentRooms = () => {
    const roomsDict = useAppSelector((state) => state.rooms.currentRooms);
    const rooms = Object.values(roomsDict ?? {});

    const sortedRooms = rooms.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return sortedRooms;
}

export const usePlayerRoom = () => {
    const { user } = useAuthenticatedUser();
    const rooms = useCurrentRooms();

    const playerRoom = rooms.find((r) => toArray(r.players).find(((p) => p.id == user.id)) != null);

    return playerRoom;
}

export const useCurrentPlayerRoom = () => {
    const playerRoom = usePlayerRoom();
    if (playerRoom) {
        return playerRoom;
    } else {
        throw new Error('You need to have a player in room to use this hook');
    }
}

export const useCurrentPlayerMatchId = () => {
    const playerRoom = useCurrentPlayerRoom();
    if (playerRoom.matchId) {
        return playerRoom.matchId;
    } else {
        throw new Error('You need to have a player in a room with a started match to use this hook');
    }
}