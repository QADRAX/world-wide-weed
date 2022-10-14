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

export type MatchPlayer = {
    hand: WeedCard[];
    fields: Field[];
    playerId: string;
    smokedScore: number;
}

export type MatchSnapshot = {
    players: MatchPlayer[];
    deck: WeedCard[];
    discards: WeedCard[];
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