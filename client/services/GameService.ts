import { CreateRoomRequest } from "../../pages/api/rooms/create";
import { DeleteRoomRequest } from "../../pages/api/rooms/delete";
import { JoinRoomRequest } from "../../pages/api/rooms/join";
import { ReadyToMatchRequest } from "../../pages/api/rooms/ready";
import { WeedRoom } from "../../types/weed/WeedTypes";
import { Dict } from "../../utils/Dict";
import { firebaseClient } from "../firebaseClient";

export namespace GameService {

    export async function getCurrentRooms(): Promise<Dict<WeedRoom> | undefined> {
        const database = firebaseClient.database();
        const matchesRef = database.ref('/rooms');
        const snap = await matchesRef.once('value');
        const roomsDict = snap.val() as Dict<WeedRoom> | undefined;
        return roomsDict;
    }

    export async function attachToCurrentRooms(callback: (rooms: Dict<WeedRoom> | undefined) => void) {
        const database = firebaseClient.database();
        const matchesRef = database.ref('/rooms');
        matchesRef.on('value', (snap) => {
            const roomsDict = snap.val() as Dict<WeedRoom> | undefined;
            callback(roomsDict);
        });
    }
    
    export async function createRoom(request: CreateRoomRequest) {
        await window.fetch('/api/rooms/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }

    export async function joinRoom(request: JoinRoomRequest){
        await window.fetch('/api/rooms/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }

    export async function leaveRoom() {
        await window.fetch('/api/rooms/leave');
    }

    export async function readyToPlay(request: ReadyToMatchRequest) {
        await window.fetch('/api/rooms/ready', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }

    export async function deleteRoom(request: DeleteRoomRequest) {
        await window.fetch('/api/rooms/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }

}