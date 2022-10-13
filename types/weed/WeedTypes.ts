import { WeedPlayer } from "types/WeedPlayer";

export type ActionableCardType = 'weedkiller'
    | 'monzon'
    | 'stealer'
    | 'hippie'
    | 'potzilla';

export type EmptyCardType = 'empty';

export type ProtectableCardType = 'dog' | 'busted';

export type HarvestableCardType = 'weed1'
    | 'weed2'
    | 'weed3'
    | 'weed4'
    | 'weed6'
    | 'dandileon'

export type CardType = HarvestableCardType
    | ProtectableCardType
    | ActionableCardType;

export type FieldValue = EmptyCardType
    | HarvestableCardType;

export type ProtectedFieldValue = EmptyCardType 
    | ProtectableCardType;

export type WeedCard = {
    id: string;
    type: CardType;
}

export type WeedField = {
    id: string;
    value: FieldValue;
    valueOwnerId: string;
    protectedValue: ProtectedFieldValue;
    protectedValueOwnerId: string;
}

export type GameType = 'standar';

export type WeedMatchPlayer = {
    hand: WeedCard[];
    filds: WeedField[];
    player: WeedPlayer;
}

export type WeedMatch = {
    gameType: GameType;
    player: WeedPlayer[];
    deck: WeedCard[];
    discards: WeedCard[];
    maxFields: number;
    currentTurn: number;
    currentPlayerBrick: boolean;
    gameOver: boolean;
    totalCards: number;
}