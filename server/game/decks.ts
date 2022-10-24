import { v4 as uuidv4 } from 'uuid';
import { CardType, WeedCard } from '../../types/WeedTypes';

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
        ...getCards('dandileon', 5),
        ...getCards('weedkiller', 5),
        ...getCards('busted', 2),
        ...getCards('hippie', 3),
        ...getCards('stealer', 5),
        ...getCards('dog', 2),
        ...getCards('monzon', 1),
        ...getCards('potzilla', 1),
    ];
}
