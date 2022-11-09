import { ChatMessage } from "../../types/ChatMessage";
import { WeedRoom } from "../../types/WeedTypes";
import { toArray } from "../../utils/Dict";
import { useAppSelector } from "./redux";
import { useAuthenticatedUser } from "./useAuth";

/**
 * Returns the existing rooms in the redux store
 * @returns sorted array of weed rooms
 */
export const useCurrentRooms = (): WeedRoom[] => {
    const roomsDict = useAppSelector((state) => state.rooms.currentRooms);
    const rooms = Object.values(roomsDict ?? {});

    const sortedRooms = rooms.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return sortedRooms;
}

/**
 * Returns the room that the current user is currently in
 * @returns current user room
 */
export const usePlayerRoom = (): WeedRoom | undefined => {
    const { user } = useAuthenticatedUser();
    const rooms = useCurrentRooms();

    const playerRoom = rooms.find((r) => toArray(r.players).find(((p) => p.id == user.id)) != null);

    return playerRoom;
}

/**
 * Returns the room that the current user is currently in but if not, throws an error.
 * 
 * @throws Error if the user is not in a room
 * 
 * @returns current user room
 */
export const useCurrentPlayerRoom = () => {
    const playerRoom = usePlayerRoom();
    if (playerRoom) {
        return playerRoom;
    } else {
        throw new Error('You need to have a player in room to use this hook');
    }
}

/**
 * Returns the matchId of the room
 * 
 * @throws Error if the user is not in a room or if the room does not have a matchId
 * 
 * @returns current match id
 */
export const useCurrentPlayerMatchId = () => {
    const playerRoom = useCurrentPlayerRoom();
    if (playerRoom.matchId) {
        return playerRoom.matchId;
    } else {
        throw new Error('You need to have a player in a room with a started match to use this hook');
    }
}

/**
 * Returns if the current user is ready for the match to start
 * 
 * @throws Error if the user is not in a room
 * 
 * @returns isPlayerReady for the match
 */
export const useIsCurrentPlayerReady = () => {
    const { user } = useAuthenticatedUser();
    const currentRoom = useCurrentPlayerRoom();

    const readyPlayersIdsDict = currentRoom.readyPlayersIds ?? {};
    const readyPlayersIds = toArray(readyPlayersIdsDict);
    const isPlayerReady = readyPlayersIds.includes(user.id);
    return isPlayerReady;
}

export const useRoomMessages = (): ChatMessage[] => {
    const chatMessages = useAppSelector((state) => state.rooms.currentChatMessages) ?? [];
    

    const sortedMessages = [...chatMessages].sort((a, b) => {
        return a.date - b.date;
    });

    const splittedMessages = sortedMessages.splice(sortedMessages.length - 100, sortedMessages.length);
    return splittedMessages;
}