import { HarvestableCardType } from "./WeedTypes";

export const getHarvestableWeedCardValue = (type: HarvestableCardType) => {
    switch (type) {
        default:
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