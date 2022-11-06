import { LoadingButton } from '@mui/lab';
import { Divider } from '@mui/material';
import { Stack } from '@mui/system';
import { motion } from 'framer-motion';
import React from 'react';
import { PlayCardRequest } from '../../../../types/WeedTypes';
import { ANIMATION_VERTICAL_FADE } from '../../../config/animations';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useAuthenticatedUser } from '../../../hooks/useAuth';
import { useCurrentHand, useIsValidSelection, useSelectedCardType, useSelectedDestinationField, useSelectedTargetField } from '../../../hooks/usePlayerMatch';
import { playCardAction } from '../../../redux/match/match';
import { HandCard } from './HandCard';

export const Hand = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuthenticatedUser();
    const selectedCard = useSelectedCardType();
    const targetPlayerId = useAppSelector((state) => state.match.targetPlayerId);
    const {
        field: targetField,
    } = useSelectedTargetField();

    const {
        field: destinationField,
    } = useSelectedDestinationField();
    const isLoading = useAppSelector((state) => state.match.isLoading);
    const hand = useCurrentHand();
    const isValidSelection = useIsValidSelection();

    const onPlayClick = () => {
        if (selectedCard && targetPlayerId && targetField) {
            const request: PlayCardRequest = {
                playerId: user.id,
                cardType: selectedCard,
                targetPlayerId: targetPlayerId,
                targetFieldId: targetField.id,
                destinationFieldId: destinationField?.id,
            };
            dispatch(playCardAction(request));
        }
    };

    return (
        <Stack direction="column">
            <LoadingButton disabled={!isValidSelection} sx={{ mt: 1 }} onClick={onPlayClick} loading={isLoading}>
                Play
            </LoadingButton>
            <Divider flexItem sx={{ mt: 1, mb: 3 }} component={motion.div} {...ANIMATION_VERTICAL_FADE}>
            </Divider>
            <Stack sx={{ ml: 2, mr: 2, mb: 2 }} direction="row" spacing={1} justifyContent="center" alignItems="center">
                {hand.map((card) => (
                    <HandCard key={card.id} card={card} />
                ))}
            </Stack>
        </Stack>

    );
};