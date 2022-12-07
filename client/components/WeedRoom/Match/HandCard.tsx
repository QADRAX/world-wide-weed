import React from 'react';
import { WeedCard } from '../../../../types/WeedTypes';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useIsCurrentPlayerTurn } from '../../../hooks/usePlayerMatch';
import { setDestinationFieldId, setSelectedCardId, setTargetFieldId, setTargetPlayerId } from '../../../redux/match/match';
import { WeedCard as WeedCardComponent } from './WeedCard';

export type HandCardProps = {
    card: WeedCard;
    hidden?: boolean;
};

export const HandCard: React.FunctionComponent<HandCardProps> = (props) => {
    const dispatch = useAppDispatch();
    const isCurrentPlayerTurn = useIsCurrentPlayerTurn();
    const selectedId = useAppSelector((state) => state.match.selectedCardId);
    
    const isDisabled = !isCurrentPlayerTurn;
    const isSelected = !isDisabled && selectedId === props.card.id;

    const onCardClick = () => {
        if(!isDisabled) {
            if(isSelected) {
                dispatch(setSelectedCardId(undefined));
            } else {
                dispatch(setSelectedCardId(props.card.id));
            }
            dispatch(setTargetPlayerId(undefined));
            dispatch(setTargetFieldId(undefined));
            dispatch(setDestinationFieldId(undefined));
        }
    };

    return (
        <WeedCardComponent
            hidden={props.hidden}
            selected={isSelected ? 'hand' : undefined}
            onClick={onCardClick}
            cardType={props.card.type}
            disabled={isDisabled} />
    );
};