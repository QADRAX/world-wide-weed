import { WeedPlayer } from "./Player";

export type ChatMessage = {
    text: string;
    date: number;
    sender: WeedPlayer;
}