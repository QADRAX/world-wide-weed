import { v4 as uuidv4 } from 'uuid';
import { CardType, WeedCard } from '../../types/WeedTypes';
import { DeckSchema } from '../../types/DeckSchema';
import { MAX_CUSTOM_DECK_SIZE, MIN_CUSTOM_DECK_SIZE } from '../../shared/constants';

export const getCard = (type: CardType): WeedCard => {
    const result: WeedCard = {
        id: uuidv4(),
        type,
    };
    return result;
};

export const getCards = (type: CardType, count: number): WeedCard[] => {
    const result: WeedCard[] = [];
    for (let i = 0; i < count; i++) {
        result.push(getCard(type));
    }
    return result;
};

export const getDeck = (): WeedCard[] => {
    return [
        ...getCards('weed1', 8),
        ...getCards('weed2', 6),
        ...getCards('weed3', 4),
        ...getCards('weed4', 3),
        ...getCards('weed6', 1),
        ...getCards('dandeleon', 5),
        ...getCards('weedkiller', 5),
        ...getCards('busted', 2),
        ...getCards('hippie', 3),
        ...getCards('stealer', 5),
        ...getCards('dog', 2),
        ...getCards('monzon', 1),
        ...getCards('potzilla', 1),
    ];
}

export const getDeckFromSchema = (deckSchema: DeckSchema): WeedCard[] => {
    const result: WeedCard[] = [];
    Object.entries(deckSchema).forEach(([cardType, count]) => {
        result.push(...getCards(cardType as CardType, count));
    });
    return result;
}

/**
 * Checks if the given deck schema is valid by:
 * 
 * Checks if all given cards are number of cards are non-negative.
 * 
 * Checks if the sum of all cards is máximum 60 and minimum 20.
 * 
 * @param deckSchema 
 */
export const validateDeckSchema = (deckSchema: DeckSchema): boolean => {
    const cardCounts: number[] = Object.values(deckSchema);
    const sum = cardCounts.reduce((a, b) => a + b, 0);
    const isNonNegative = cardCounts.every(count => count >= 0);
    const isWithinLimits = sum <= MAX_CUSTOM_DECK_SIZE && sum >= MIN_CUSTOM_DECK_SIZE;
    return isNonNegative && isWithinLimits;
}
