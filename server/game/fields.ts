import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_FIELDS, INCREASED_FIELDS_PLAYER_LIMIT, REDUCED_FIELDS_PLAYER_LIMIT } from '../../shared/constants';
import { Field, FieldValue } from "../../types/WeedTypes";

export const getMaxFields = (playerCount: number) => {
    let result = DEFAULT_FIELDS;
    if (playerCount <= REDUCED_FIELDS_PLAYER_LIMIT) {
        result++;
    }
    if (playerCount >= INCREASED_FIELDS_PLAYER_LIMIT) {
        result--;
    }
    return result;
};

export const getInitialFields = (playerCount: number) => {
    const result: Field[] = [];

    const maxFields = getMaxFields(playerCount);

    for (let i = 0; i < maxFields; i++) {
        const field: Field = {
            id: uuidv4(),
            value: 'empty',
            protectedValue: 'empty',
        };
        result.push(field);
    }
    return result;
}

export const getFieldValue = (type: FieldValue): number => {
    switch (type) {
        default:
        case 'empty':
        case 'dandileon':
            return 0;
        case 'weed1':
            return 1;
        case 'weed2':
            return 2;
        case 'weed3':
            return 3;
        case 'weed4':
            return 4;
        case 'weed6':
            return 6;
    }
}