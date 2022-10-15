import { Player } from "types/Player";

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

export type Field = {
    id: string;
    value: FieldValue;
    valueOwnerId?: string;
    protectedValue: ProtectedFieldValue;
    protectedValueOwnerId?: string;
}

export type MatchPlayer<P> = {
    hand: WeedCard[];
    fields: Field[];
    player: P;
    smokedScore: number;
}

export type MatchSnapshot<P extends Player> = {
    players: MatchPlayer<P>[];
    deck: WeedCard[];
    discards: WeedCard[];
}

export type ClientSideMatchPlayerSnapShot<P> = {
    fields: Field[];
    player: P;
    smokedScore: number;
}

export type ClientSideMatchSnapShot<P> = {
    players: ClientSideMatchPlayerSnapShot<P>[];
    discards: WeedCard[];
    deckSize: number;
}

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