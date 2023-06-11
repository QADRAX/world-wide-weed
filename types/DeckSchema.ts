import { CardType } from "./WeedTypes";

export type DeckSchema = Record<CardType, number>;

/**
 * The classic deck schema of the game.
 */
export const classicSchema: DeckSchema = {
    weed1: 8,
    weed2: 6,
    weed3: 4,
    weed4: 3,
    weed6: 1,
    dandeleon: 5,
    weedkiller: 5,
    busted: 2,
    hippie: 3,
    stealer: 5,
    dog: 2,
    monzon: 1,
    potzilla: 1,
};