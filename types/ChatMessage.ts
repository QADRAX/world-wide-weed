import { WeedPlayer } from "./Player";
import { CardRequestSnapshot } from "./WeedTypes";

export type RoomMessage = ChatMessage | CardRequestSnapshot;

export type ChatMessage = {
    text: string;
    date: number;
    sender: WeedPlayer;
}

export function isCardRequestSnapshot(message: RoomMessage): message is CardRequestSnapshot {
    return (message as CardRequestSnapshot).request !== undefined;
}