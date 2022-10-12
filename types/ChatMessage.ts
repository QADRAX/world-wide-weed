import { WeedPlayer } from "./WeedPlayer";

export type ChatMessage = {
    text: string;
    date: number;
    sender: WeedPlayer;
}