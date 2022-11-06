import React from 'react';
import { WeedPlayer } from '../../../../types/Player';
import { Field } from '../../../../types/WeedTypes';
import { useAppDispatch } from '../../../hooks/redux';
import { 
    useIsCurrentPlayerTurn, 
    useSelectedCardType, 
    useSelectedDestinationField, 
    useSelectedTargetField 
} from '../../../hooks/usePlayerMatch';
import { setDestinationFieldId, setTargetFieldId, setTargetPlayerId } from '../../../redux/match/match';
import { WeedCard as WeedCardComponent } from './WeedCard';

export type PlayerFieldProps = {
    player: WeedPlayer;
    field: Field;
};

export const PlayerField: React.FunctionComponent<PlayerFieldProps> = (props) => {
    const dispatch = useAppDispatch();
    const selectedCard = useSelectedCardType();
    const isCurrentPlayerTurn = useIsCurrentPlayerTurn();
    const {
        player: targetPlayer,
        field: targetField,
    } = useSelectedTargetField();

    const {
        player: destinationPlayer,
        field: destinationField,
    } = useSelectedDestinationField();

    const isOwnTarget = targetPlayer?.playerId === props.player.id;
    const isOwnDestination = destinationPlayer?.playerId === props.player.id;

    const isTarget = isOwnTarget && targetField?.id === props.field.id;
    const isDestination = isOwnDestination && destinationField?.id === props.field.id;

    const isTargetSelected = targetField != undefined;

    const isAllFieldsMove = selectedCard == 'potzilla';
    const isDestinationNeeded = selectedCard == 'stealer';
    const isDestinationEnabled = isDestinationNeeded && isTargetSelected && !isOwnTarget;

    const onFieldClick = () => {
        if (selectedCard != null && isCurrentPlayerTurn) {

            if (isTargetSelected) {
                if(isDestinationEnabled) {
                    // Select destination
                    if(isDestination){
                        dispatch(setDestinationFieldId(undefined));
                    } else {
                        dispatch(setDestinationFieldId(props.field.id));
                    }
                } else {
                    // Reselect target
                    if(isTarget){
                        dispatch(setTargetFieldId(undefined));
                        dispatch(setTargetPlayerId(undefined));
                        dispatch(setDestinationFieldId(undefined));
                    } else {
                        dispatch(setTargetFieldId(props.field.id));
                        dispatch(setTargetPlayerId(props.player.id));
                    }
                }
            } else {
                // Select target
                dispatch(setTargetFieldId(props.field.id));
                dispatch(setTargetPlayerId(props.player.id));
            }
        }
    };

    const selectedType = isDestination 
        ? 'destination' 
        : isTarget || isAllFieldsMove && isOwnTarget
            ? 'target' 
            : undefined;

    return (
        <WeedCardComponent
            selected={selectedType}
            onClick={onFieldClick}
            cardType={props.field.value}
            disabled={false}
            protectedValue={props.field.protectedValue}
        />
    );
};