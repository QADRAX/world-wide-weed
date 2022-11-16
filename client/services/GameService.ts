import { CreateRoomRequest } from "../../pages/api/rooms/create";
import { DeleteRoomRequest } from "../../pages/api/rooms/delete";
import { JoinRoomRequest } from "../../pages/api/rooms/join";
import { MessageRequest } from "../../pages/api/rooms/message";
import { ReadyToMatchRequest } from "../../pages/api/rooms/ready";
import { ChatMessage } from "../../types/ChatMessage";
import { WeedPlayer } from "../../types/Player";
import { CardRequestSnapshot, DiscardCardRequest, PlayCardRequest, ProtectedMatchSnapshot, PublicMatchSnapshot, WeedRoom } from "../../types/WeedTypes";
import { Dict, toArray } from "../../utils/Dict";
import { firebaseClient } from "../firebaseClient";

export namespace GameService {

    export async function getCurrentRooms(): Promise<Dict<WeedRoom> | undefined> {
        const database = firebaseClient.database();
        const matchesRef = database.ref('/rooms');
        const snap = await matchesRef.once('value');
        const roomsDict = snap.val() as Dict<WeedRoom> | undefined;
        return roomsDict;
    }

    export async function getPublicMatchSnapshots(matchId: string): Promise<PublicMatchSnapshot[]> {
        const database = firebaseClient.database();
        const publicSnapsRef = database.ref(`/matches/${matchId}/publicMatchSnapshots`);
        const snap = await publicSnapsRef.once('value');
        const snapshots = snap.val() as PublicMatchSnapshot[];
        return snapshots;
    }

    export async function getMatchPlayers(matchId: string): Promise<WeedPlayer[]> {
        const database = firebaseClient.database();
        const playersRef = database.ref(`/matches/${matchId}/players`);
        const snap = await playersRef.once('value');
        const players = snap.val() as WeedPlayer[];
        return players;
    }

    export async function getProtectedMatchSnapshots(
        playerId: string,
        matchId: string,
    ): Promise<ProtectedMatchSnapshot[]> {
        const database = firebaseClient.database();
        const protectedSnapsRef = database.ref(`/matches/${matchId}/protectedMatchSnapshots/${playerId}`);
        const snap = await protectedSnapsRef.once('value');
        const snapshots = snap.val() as ProtectedMatchSnapshot[];
        return snapshots;
    }

    export async function getIsCurrentPlayerBriked(
        matchId: string,
    ): Promise<boolean> {
        const database = firebaseClient.database();
        const isBrikedRef = database.ref(`/matches/${matchId}/isCurrentPlayerBriked`);
        const snap = await isBrikedRef.once('value');
        const isBriked = snap.val() as boolean;
        return isBriked;
    }

    export function subscribeToIsCurrentPlayerBriked(
        matchId: string,
        callback: (isBriked: boolean) => void,
    ): () => void {
        const database = firebaseClient.database();
        const isBrikedRef = database.ref(`/matches/${matchId}/isCurrentPlayerBriked`);
        isBrikedRef.on('value', (snap) => {
            const isBriked = snap.val() as boolean;
            callback(isBriked);
        });
        return () => isBrikedRef.off();
    }

    export function subscribeToProtectedMatchSnapshots(
        playerId: string,
        matchId: string, 
        callback: (snapshots: ProtectedMatchSnapshot[]
    ) => void): () => void {
        const database = firebaseClient.database();
        const protectedSnapsRef = database.ref(`/matches/${matchId}/protectedMatchSnapshots/${playerId}`);
        protectedSnapsRef.on('value', (snap) => {
            const snapshots = snap.val() as ProtectedMatchSnapshot[];
            callback(snapshots);
        });
        return () => {
            protectedSnapsRef.off();
        };
    }

    export function subscribeToPublicMatchSnapshots(
        matchId: string,
        callback: (roomsDict: PublicMatchSnapshot[]) => void
    ): () => void {
        const database = firebaseClient.database();
        const publicSnapsRef = database.ref(`/matches/${matchId}/publicMatchSnapshots`);
        publicSnapsRef.on('value', (snap) => {
            const snapshots = snap.val() as PublicMatchSnapshot[];
            callback(snapshots);
        });
        return () => {
            publicSnapsRef.off();
        };
    }

    export function subscribeToCardRequestHistory(
        matchId: string,
        callback: (cardRequests: CardRequestSnapshot[] | undefined) => void
    ): () => void {
        const database = firebaseClient.database();
        const cardRequestsRef = database.ref(`/matches/${matchId}/cardRequestHistory`);
        cardRequestsRef.on('value', (snap) => {
            const cardRequests = snap.val() as CardRequestSnapshot[] | undefined;
            callback(cardRequests);
        });
        return () => {
            cardRequestsRef.off();
        };
    }

    export function subscribeToChat(
        roomId: string,
        callback: (chat: ChatMessage[] | undefined) => void
    ): () => void {
        const database = firebaseClient.database();
        const chatRef = database.ref(`/roomChat/${roomId}/chat`);
        chatRef.on('value', (snap) => {
            const chat = snap.val() as Dict<ChatMessage> | undefined;
            callback(toArray(chat));
        });
        return () => {
            chatRef.off();
        };
    }

    export async function sendRoomMessage(
        request: MessageRequest,
    ): Promise<void> {
        await window.fetch('/api/rooms/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }

    export function subscribeToCurrentRooms(callback: (rooms: Dict<WeedRoom> | undefined) => void) {
        const database = firebaseClient.database();
        const matchesRef = database.ref('/rooms');
        matchesRef.on('value', (snap) => {
            const roomsDict = snap.val() as Dict<WeedRoom> | undefined;
            callback(roomsDict);
        });

        return () => {
            matchesRef.off();
        }
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

    export async function playCard(request: PlayCardRequest) {
        await window.fetch('/api/match/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }

    export async function discardCard(request: DiscardCardRequest) {
        await window.fetch('/api/match/discard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }
}