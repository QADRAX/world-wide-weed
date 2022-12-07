import { FieldValue, PrivateMatchPlayer, PublicMatchPlayer } from "../types/WeedTypes";

export function getFieldValue(type: FieldValue): number {
    switch (type) {
        default:
        case 'empty':
        case 'dandeleon':
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

export function getPlayerPoints(
    matchPlayer: PublicMatchPlayer | PrivateMatchPlayer,
): number {
    let points = matchPlayer.smokedScore;

    matchPlayer.fields.forEach((field) => {
        if(field.protectedValue != 'busted') {
            points += getFieldValue(field.value);
        }
    });

    return points;
}