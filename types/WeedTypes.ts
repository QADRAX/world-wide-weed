import { Dict } from "../utils/Dict";
import { DeckSchema } from "./DeckSchema";
import { WeedPlayer } from "./Player";

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
    | 'dandeleon'

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
    hand: WeedCard[] | undefined;
    fields: Field[];
    playerId: string;
    smokedScore: number;
}

export type PublicMatchPlayer = {
    handSize: number;
    fields: Field[];
    playerId: string;
    smokedScore: number;
}

// MATCH SNAPSHOT

export type PrivateMatchSnapshot = {
    players: PrivateMatchPlayer[];
    deck: WeedCard[] | undefined;
    discards: WeedCard[] | undefined;
}

export type PublicMatchSnapshot = {
    players: PublicMatchPlayer[];
    deckSize: number;
    discards: WeedCard[] | undefined;
}

export type ProtectedMatchSnapshot = {
    hand: WeedCard[] | undefined;
    isEmpty: boolean;
}

export type CardRequestSnapshot = {
    date: number;
    request: CardRequest;
};

// MATCH

export type WeedMatch = {
    id: string;
    /** Current players in the match (anybody could read this) */
    players: WeedPlayer[];
    /** Flag that indicates if current player is briked */
    isCurrentPlayerBriked: boolean;
    /** Server side info. (only server side could read) */
    privateMatchSnapshots?: PrivateMatchSnapshot[];
    /** Public match info. (anybody could read) */
    publicMatchSnapshots?: PublicMatchSnapshot[];
    /** Protected match info. (only match users could read) */
    protectedMatchSnapshots: Dict<ProtectedMatchSnapshot[] | undefined>;
    /** History of requests did by the users (anybody could read) */
    cardRequestHistory?: CardRequestSnapshot[];
    /** Deck schema of the match (anybody could read) */
    deckSchema: DeckSchema;
}

export type WeedRoom = {
    id: string;
    name: string;
    players?: Dict<WeedPlayer>,
    readyPlayersIds?: Dict<string>,
    matchId?: string | null;
    deckSchema: DeckSchema;
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
    targetFieldId?: string;
    destinationFieldId?: string;
}

export type DiscardCardRequest = {
    playerId: string;
    cardType: CardType;
}