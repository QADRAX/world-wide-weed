import { WeedRoom } from "../../types/WeedTypes";
import { firebaseAdmin } from "../firebaseAdmin";
import { v4 } from 'uuid';
import { toWeedPlayer } from "../../shared/mappers";
import { UserInfo } from "../../types/UserInfo";
import { Dict, toArray } from "../../utils/Dict";

export namespace RoomRepository {
    export async function createRoom(
        roomName: string,
    ): Promise<WeedRoom> {
        const database = firebaseAdmin.database();
        const roomId = v4();
    
        const room: WeedRoom = {
            id: roomId,
            name: roomName,
            players: {},
            readyPlayersIds: {},
            matchId: null,
        };
        await database.ref(`rooms/${roomId}`).set(room);
    
        return room;
    }
    
    export async function getPlayerRoom(
        playerId: string
    ): Promise<WeedRoom | undefined> {
        const database = firebaseAdmin.database();
        const matchesRef = database.ref('/rooms');
        const snap = await matchesRef.once('value');
        const roomsDict = snap.val() as Dict<WeedRoom> | undefined;
        const rooms = toArray(roomsDict);
        const room = rooms
            .find((m) => toArray(m.players).find(((p) => p.id == playerId)) != null);
        return room;
    }
    
    export async function getWeedRooms(
    ): Promise<WeedRoom[]> {
        const database = firebaseAdmin.database();
        const snap = await database.ref(`/rooms`).once('value');
        const roomsDict = snap.val() as Dict<WeedRoom> | undefined;
        const rooms = toArray(roomsDict);
        return rooms;
    }
    
    export async function getWeedRoom(
        roomId: string
    ): Promise<WeedRoom | undefined> {
        const database = firebaseAdmin.database();
        const snap = await database.ref(`/rooms/${roomId}`).once('value');
        const ongoingMatch = snap.val() as WeedRoom | undefined;
        return ongoingMatch;
    }
    
    export async function joinToRoom(
        user: UserInfo,
        roomId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const nextPlayerRef = database.ref(`/rooms/${roomId}/players/${user.id}`);
        await nextPlayerRef.set(toWeedPlayer(user));
    }

    export async function leaveRoom(
        user: UserInfo,
        roomId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const nextPlayerRef = database.ref(`/rooms/${roomId}/players/${user.id}`);
        await nextPlayerRef.remove();
    }
    
    export async function isPlayerReady(
        user: UserInfo,
        roomId: string,
    ): Promise<boolean> {
        const database = firebaseAdmin.database();
        const readyPlayersIdsDictSnap = await database.ref(`/rooms/${roomId}/readyPlayersIds`).once('value');
        const readyPlayersIdsDict = await readyPlayersIdsDictSnap.val() as Dict<string>;
        const readyPlayersIds = toArray(readyPlayersIdsDict);
        const isPlayerReady = readyPlayersIds.includes(user.id);
        return isPlayerReady;
    }
    
    export async function setReadyToMatch(
        user: UserInfo,
        roomId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const nextReadyPlayerRef = database.ref(`/rooms/${roomId}/readyPlayersIds/${user.id}`);
        await nextReadyPlayerRef.set(user.id);
    }

    export async function undoReadyToMatch(
        user: UserInfo,
        roomId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const nextReadyPlayerRef = database.ref(`/rooms/${roomId}/readyPlayersIds/${user.id}`);
        await nextReadyPlayerRef.remove();
    }
    
    export async function setMatchId(
        roomId: string,
        matchId: string | undefined,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const matchIdRef = database.ref(`/rooms/${roomId}/matchId`);
        await matchIdRef.set(matchId);
    }

    export async function clearReadyPlayers(
        roomId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const readyPlayersIdsRef = database.ref(`/rooms/${roomId}/readyPlayersIds`);
        await readyPlayersIdsRef.set({});
    }

    export async function deletePlayers(
        roomId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const playersRef = database.ref(`/rooms/${roomId}/players`);
        await playersRef.set({});
    }

    export async function deleteRoom(
        roomId: string,
    ): Promise<void> {
        const database = firebaseAdmin.database();
        const roomRef = database.ref(`/rooms/${roomId}`);
        await roomRef.remove();
    }
}
