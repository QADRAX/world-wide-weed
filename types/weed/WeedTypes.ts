import { Dict } from "../../utils/Dict";
import { WeedPlayer } from "../Player";

// CARD TYPES

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

// WEED FIELD

export type Field = {
    id: string;
    value: FieldValue;
    valueOwnerId?: string;
    protectedValue: ProtectedFieldValue;
    protectedValueOwnerId?: string;
}

// MATCH PLAYER

export type PrivateMatchPlayer = {
    hand: WeedCard[];
    fields: Field[];
    player: WeedPlayer;
    smokedScore: number;
}

export type PublicMatchPlayer = {
    handSize: number;
    fields: Field[];
    player: WeedPlayer;
    smokedScore: number;
}

// MATCH SNAPSHOT

export type PrivateMatchSnapshot = {
    players: PrivateMatchPlayer[];
    deck: WeedCard[];
    discards: WeedCard[];
}

export type PublicMatchSnapshot = {
    players: PublicMatchPlayer[];
    deckSize: number;
    discards: WeedCard[];
}

export type ProtectedMatchSnapshot = {
    hand: WeedCard[];
}

// MATCH

export type WeedMatch = {
    id: string;
    /** Current players in the match (anybody could read this) */
    players: WeedPlayer[];
    /** Server side info. (only server side could read) */
    privateMatchSnapshots: PrivateMatchSnapshot[];
    /** Public match info. (anybody could read) */
    publicMatchSnapshots: PublicMatchSnapshot[];
    /** Protected match info. (only match users could read) */
    protectedMatchSnapshots: Dict<ProtectedMatchSnapshot[]>;
}

export type WeedRoom = {
    id: string;
    name: string;
    players?: Dict<WeedPlayer>,
    readyPlayersIds?: Dict<string>,
    matchId?: string | null;
}

// PLAY CARD REQUEST

export type CardRequest = PlayCardRequest | DiscardCardRequest;

export function isPlayCardRequest(
    request: CardRequest
): request is PlayCardRequest {
    const r = request as any
    if (r.targetPlayerId) {
        return true;
    } else {
        return false;
    }
}

export type PlayCardRequest = {
    playerId: string;
    targetPlayerId: string;
    cardType: CardType;
    tagetPlayerFieldId?: string;
    destinationPlayerFieldId?: string;
}

export type DiscardCardRequest = {
    playerId: string;
    cardType: CardType;
}