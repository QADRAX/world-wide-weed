import { v4 as uuidv4 } from 'uuid';
import { CardType, WeedCard } from '../../types/weed/WeedTypes';

export const getCard = (type: CardType): WeedCard => {
    return {
        id: uuidv4(),
        type: type,
    };
};

export const getCards = (type: CardType, count: number): WeedCard[] =>
    Array(count).map(() => getCard(type));


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
