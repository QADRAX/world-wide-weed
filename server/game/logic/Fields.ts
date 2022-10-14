import { DEFAULT_FIELDS, INCREASED_FIELDS_PLAYER_LIMIT, REDUCED_FIELDS_PLAYER_LIMIT } from "../GameConstants";
import { v4 as uuidv4 } from 'uuid';
import { Field } from "types/weed/WeedTypes";

export const getMaxFields = (playerCount: number) => {
    let result = DEFAULT_FIELDS;
    if(playerCount <= REDUCED_FIELDS_PLAYER_LIMIT) {
        result++;
    }
    if(playerCount >= INCREASED_FIELDS_PLAYER_LIMIT) {
        result--;
    }
    return result;
};

export const getInitialFields = (playerCount: number) => {
    const maxFields = getMaxFields(playerCount);

    const result = Array(maxFields).map(() => {
        const field: Field = {
            id: uuidv4(),
            value: 'empty',
            protectedValue: 'empty',
        }
        return field;
    });

    return result;
}