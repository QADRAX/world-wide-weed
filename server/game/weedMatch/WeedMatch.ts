import { ValidationResult } from "types/ValidationResult";
import { MatchErrors } from "../../../types/weed/MatchErrors";
import { CardRequest, DiscardCardRequest, isPlayCardRequest, MatchSnapshot, PlayCardRequest } from "../../../types/weed/WeedTypes";
import { Player } from "types/Player";
import { getFieldValue } from "./WeedMatch.Fields";

/**
 * Weed Match instance
 */
export abstract class WeedMatch<P extends Player> {
    history: MatchSnapshot<P>[];
    requestHistory: CardRequest[];
    isStandar: boolean = false;

    get currentTurn() {
        return this.history.length - 1;
    }

    get currentSnapshot() {
        return this.history[this.currentTurn];
    }

    get currentPlayerBrick() {
        return this.isCurrentPlayerBrick(this.currentSnapshot);
    }

    get deckSike() {
        return this.currentSnapshot.deck.length;
    }

    get gameOver() {
        return this.isGameOver(this.currentSnapshot);
    }

    get players() {
        return this.currentSnapshot.players;
    }

    constructor(initialSnapshot: MatchSnapshot<P>, requestHistory: CardRequest[] = []) {
        this.history = [initialSnapshot];
        this.requestHistory = requestHistory;
    }

    public playCard(request: CardRequest): ValidationResult<MatchErrors, MatchSnapshot<P>> {
        const validationResult = isPlayCardRequest(request)
            ? this.executePlayCard(this.currentSnapshot, request)
            : this.executeDiscardCard(this.currentSnapshot, request);

        if (validationResult.result) {
            this.history.push(validationResult.result);
            this.requestHistory.push(request);
        }
        return validationResult;
    }

    public isPlayerInMatch(player: P): boolean {
        const existingPlayer = this.currentSnapshot.players.find((p) => p.player.id == player.id);
        return existingPlayer != null;
    }

    /**
     * 
     * @param request 
     * @returns validation result of the play
     */
    private executePlayCard(snapshot: MatchSnapshot<P>, request: PlayCardRequest): ValidationResult<MatchErrors, MatchSnapshot<P>> {
        const result: ValidationResult<MatchErrors, MatchSnapshot<P>> = {
            result: undefined,
            errors: [],
        };
        const snap = Object.assign({}, snapshot);
        const isGameOver = this.isGameOver(snap);
        if (isGameOver) {
            result.errors.push(MatchErrors.GameOver);
        } else {
            const numberOfPlayers = snap.players.length;

            const currentPlayerIndex = this.currentTurn % numberOfPlayers;
            const currentPlayer = snap.players[currentPlayerIndex];

            const nextPlayerIndex = (this.currentTurn + 1) % numberOfPlayers;
            const nextPlayer = snap.players[nextPlayerIndex];

            const player = snap.players.find((p) => p.player.id == request.playerId);
            if (player) {
                const isPlayersTurn = currentPlayer.player.id == request.playerId;
                if (isPlayersTurn) {
                    const targetPlayer = snap.players.find((p) => p.player.id == request.targetPlayerId);
                    if (targetPlayer) {
                        const currentPlayerHand = player.hand;
                        const currentCard = currentPlayerHand.find((c) => c.type == request.cardType);
                        if (currentCard) {

                            const isOwnTarget = targetPlayer.player.id == player.player.id;
                            const targetField = targetPlayer.fields.find((f) => f.id == request.tagetPlayerFieldId);

                            /**
                             * Apply next play 
                             * @param applyCardLogic 
                             */
                            const applyNextMove = (applyCardLogic: () => void) => {
                                const applyDiscard = () => {
                                    const currentCardIndex = player.hand.indexOf(currentCard);
                                    player.hand.splice(currentCardIndex, 1);
                                    snap.discards.push(currentCard);
                                };
                                const applyNextPlayerDraw = () => {
                                    const handSize = nextPlayer.hand.length;
                                    const numberOfFields = nextPlayer.fields.length

                                    if (handSize < numberOfFields) {
                                        const nextCard = snap.deck.pop();
                                        if (nextCard) {
                                            nextPlayer.hand.push(nextCard);
                                        }
                                    }
                                };
                                applyDiscard();
                                applyCardLogic();
                                applyNextPlayerDraw();
                                result.result = snap;
                            }

                            switch (request.cardType) {

                                // Harvasteable Cards

                                case 'dandileon':
                                case 'weed1':
                                case 'weed2':
                                case 'weed3':
                                case 'weed4':
                                case 'weed6':
                                    const harvestValue = getFieldValue(request.cardType);
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog' && !isOwnTarget) {
                                                result.errors.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value != 'dandileon') {
                                                    let availableEmptyTargetFields = targetPlayer.fields.filter((f) => f.value == 'empty');
                                                    if (isOwnTarget) {
                                                        availableEmptyTargetFields = availableEmptyTargetFields.filter((f) => f.protectedValue != 'dog');
                                                    }
                                                    if (targetField.value != 'empty' && availableEmptyTargetFields.length > 0) {
                                                        result.errors.push(MatchErrors.CannotUpgradePlantIfEmptyFieldAvailable);
                                                    } else {
                                                        const targetFieldValue = getFieldValue(targetField.value);
                                                        if (harvestValue < targetFieldValue) {
                                                            result.errors.push(MatchErrors.CannotPlantLessValueWeed);
                                                        } else {
                                                            // APPLY
                                                            const nextValue = request.cardType;
                                                            applyNextMove(() => {
                                                                targetField.value = nextValue;
                                                                targetField.valueOwnerId = player.player.id;
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    result.errors.push(MatchErrors.CannotPlantOverDandis);
                                                }
                                            }
                                        } else {
                                            result.errors.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.errors.push(MatchErrors.TargetFieldDoesNotExist);
                                    }
                                    break;

                                // Actionable Cards

                                case 'weedkiller':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog' && !isOwnTarget) {
                                                result.errors.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value != 'empty') {
                                                    applyNextMove(() => {
                                                        targetField.value = 'empty';
                                                        targetField.valueOwnerId = undefined;
                                                    });
                                                } else {
                                                    result.errors.push(MatchErrors.CannotKillEmptyFields);
                                                }
                                            }
                                        } else {
                                            result.errors.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.errors.push(MatchErrors.TargetFieldDoesNotExist);
                                    }
                                    break;
                                case 'monzon':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'empty' || targetField.value != 'empty') {
                                            applyNextMove(() => {
                                                if (targetField.protectedValue != 'empty') {
                                                    targetField.protectedValue = 'empty';
                                                    targetField.protectedValueOwnerId = undefined;
                                                } else {
                                                    targetField.value = 'empty';
                                                    targetField.valueOwnerId = undefined;
                                                }
                                            });
                                        } else {
                                            result.errors.push(MatchErrors.CannotKillEmptyFields);
                                        }
                                    } else {
                                        result.errors.push(MatchErrors.TargetFieldDoesNotExist);
                                    }
                                    break;
                                case 'stealer':
                                    const destinationFieldId = request.destinationPlayerFieldId;
                                    const destinationPlayer = snap.players.find((p) => {
                                        const field = p.fields.find((f) => f.id == destinationFieldId);
                                        return field != null;
                                    });
                                    if (destinationPlayer) {
                                        const destinationField = destinationPlayer.fields.find((f) => f.id == destinationFieldId);
                                        if (destinationField) {
                                            if (isOwnTarget) {
                                                result.errors.push(MatchErrors.CannotStealYourOwnFields);
                                            } else {
                                                if (targetField) {
                                                    if (targetField.protectedValue != 'busted') {
                                                        if (targetField.protectedValue == 'dog') {
                                                            // Stealing a dog
                                                            if (destinationField.protectedValue == 'empty') {

                                                                applyNextMove(() => {
                                                                    targetField.protectedValue = 'empty';
                                                                    const dogOwner = targetField.protectedValueOwnerId;

                                                                    destinationField.protectedValue = 'dog';
                                                                    destinationField.protectedValueOwnerId = dogOwner;
                                                                });
                                                            } else {
                                                                result.errors.push(MatchErrors.ProtectedField);
                                                            }

                                                        } else {
                                                            // Stealing a plant
                                                            if (targetField.value != 'empty') {
                                                                if (destinationField.protectedValue != 'busted') {
                                                                    const isOwnDestination = destinationPlayer.player.id == player.player.id;
                                                                    if (destinationField.protectedValue == 'dog' && !isOwnDestination) {
                                                                        result.errors.push(MatchErrors.ProtectedByDog);
                                                                    } else {
                                                                        // replant logic
                                                                        if (destinationField.value != 'dandileon') {
                                                                            let availableEmptyTargetFields = destinationPlayer.fields.filter((f) => f.value == 'empty');
                                                                            if (isOwnDestination) {
                                                                                availableEmptyTargetFields = availableEmptyTargetFields.filter((f) => f.protectedValue != 'dog');
                                                                            }
                                                                            if (destinationField.value != 'empty' && availableEmptyTargetFields.length > 0) {
                                                                                result.errors.push(MatchErrors.CannotUpgradePlantIfEmptyFieldAvailable);
                                                                            } else {
                                                                                const destinationFieldValue = getFieldValue(destinationField.value);
                                                                                const targetFieldValue = getFieldValue(targetField.value);
                                                                                if (targetFieldValue < destinationFieldValue) {
                                                                                    result.errors.push(MatchErrors.CannotPlantLessValueWeed);
                                                                                } else {
                                                                                    // APPLY weed stealer
                                                                                    applyNextMove(() => {
                                                                                        const targetOwner = targetField.valueOwnerId;
                                                                                        const targetValue = targetField.value;

                                                                                        targetField.value = 'empty';
                                                                                        targetField.valueOwnerId = undefined;

                                                                                        destinationField.value = targetValue;
                                                                                        destinationField.valueOwnerId = targetOwner;
                                                                                    });
                                                                                }
                                                                            }
                                                                        } else {
                                                                            result.errors.push(MatchErrors.CannotPlantOverDandis);
                                                                        }
                                                                    }
                                                                } else {
                                                                    result.errors.push(MatchErrors.BustedField);
                                                                }
                                                            } else {
                                                                result.errors.push(MatchErrors.CannotStealEmptyFields);
                                                            }
                                                        }
                                                    } else {
                                                        result.errors.push(MatchErrors.BustedField);
                                                    }
                                                } else {
                                                    result.errors.push(MatchErrors.TargetFieldDoesNotExist);
                                                }
                                            }
                                        } else {
                                            result.errors.push(MatchErrors.NoDestinationField);
                                        }
                                    } else {
                                        result.errors.push(MatchErrors.NoDestinationField);
                                    }

                                    break;
                                case 'hippie':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog' && !isOwnTarget) {
                                                result.errors.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value != 'empty' && targetField.value != 'dandileon') {
                                                    applyNextMove(() => {
                                                        const harvestValue = getFieldValue(targetField.value);
                                                        targetField.value = 'empty';
                                                        targetField.valueOwnerId = undefined;
                                                        player.smokedScore += harvestValue;
                                                    });
                                                } else {
                                                    result.errors.push(MatchErrors.HippieNeedsToSmokeSomething);
                                                }
                                            }
                                        } else {
                                            result.errors.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.errors.push(MatchErrors.TargetFieldDoesNotExist);
                                    }
                                    break;
                                case 'potzilla':
                                    // Apply
                                    applyNextMove(() => {
                                        targetPlayer.fields.forEach((field) => {
                                            if (field.protectedValue != 'empty') {
                                                field.protectedValue = 'empty';
                                                field.protectedValueOwnerId = undefined;
                                            } else {
                                                field.value = 'empty';
                                                field.valueOwnerId = undefined;
                                            }
                                        });
                                    });
                                    break;

                                // Protectable Cards

                                case 'busted':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog') {
                                                result.errors.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                // Apply
                                                applyNextMove(() => {
                                                    targetField.protectedValue = 'busted';
                                                    targetField.protectedValueOwnerId = player.player.id;
                                                });
                                            }
                                        } else {
                                            result.errors.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.errors.push(MatchErrors.TargetFieldDoesNotExist);
                                    }

                                    break;

                                case 'dog':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog') {
                                                result.errors.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value == 'empty' || targetField.value == 'dandileon') {
                                                    result.errors.push(MatchErrors.NotIlegalField);
                                                } else {
                                                    // Apply
                                                    applyNextMove(() => {
                                                        targetField.protectedValue = 'dog';
                                                        targetField.protectedValueOwnerId = player.player.id;
                                                    });
                                                }
                                            }
                                        } else {
                                            result.errors.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.errors.push(MatchErrors.TargetFieldDoesNotExist);
                                    }
                                    break;

                                default:
                                    result.errors.push(MatchErrors.InvalidCardType);
                                    break;
                            }
                        } else {
                            result.errors.push(MatchErrors.CardNotExistInPlayersHand);
                        }
                    } else {
                        result.errors.push(MatchErrors.TargetPlayerNotInMatch);
                    }
                } else {
                    result.errors.push(MatchErrors.NotPlayersTurn);
                }
            } else {
                result.errors.push(MatchErrors.NotInMatch);
            }
        }

        return result;
    }

    private executeDiscardCard(snapshot: MatchSnapshot<P>, request: DiscardCardRequest): ValidationResult<MatchErrors, MatchSnapshot<P>> {
        const result: ValidationResult<MatchErrors, MatchSnapshot<P>> = {
            result: undefined,
            errors: [],
        };
        const snap = Object.assign({}, snapshot);
        const isGameOver = this.isGameOver(snap);

        if (isGameOver) {
            result.errors.push(MatchErrors.GameOver);
        } else {
            const numberOfPlayers = snap.players.length;

            const currentPlayerIndex = this.currentTurn % numberOfPlayers;
            const currentPlayer = snap.players[currentPlayerIndex];

            const nextPlayerIndex = (this.currentTurn + 1) % numberOfPlayers;
            const nextPlayer = snap.players[nextPlayerIndex];

            const player = snap.players.find((p) => p.player.id == request.playerId);

            if (player) {

                const isPlayersTurn = currentPlayer.player.id == request.playerId;
                if (isPlayersTurn) {
                    const currentPlayerHand = player.hand;
                    const currentCard = currentPlayerHand.find((c) => c.type == request.cardType);
                    if (currentCard) {
                        const isBrick = this.isCurrentPlayerBrick(snap);
                        if (isBrick) {
                            const applyDiscard = () => {
                                const currentCardIndex = player.hand.indexOf(currentCard);
                                player.hand.splice(currentCardIndex, 1);
                                snap.discards.push(currentCard);
                            };
                            const applyNextPlayerDraw = () => {
                                const handSize = nextPlayer.hand.length;
                                const numberOfFields = nextPlayer.fields.length

                                if (handSize < numberOfFields) {
                                    const nextCard = snap.deck.pop();
                                    if (nextCard) {
                                        nextPlayer.hand.push(nextCard);
                                    }
                                }
                            };
                            applyDiscard();
                            applyNextPlayerDraw();
                            result.result = snap;

                        } else {
                            result.errors.push(MatchErrors.IsNotBrick)
                        }
                    } else {
                        result.errors.push(MatchErrors.CardNotExistInPlayersHand);
                    }
                } else {
                    result.errors.push(MatchErrors.NotPlayersTurn);
                }

            } else {
                result.errors.push(MatchErrors.NotInMatch);
            }
        }
        return result;
    }

    private isGameOver(snap: MatchSnapshot<P>) {
        const emptyHandsPlayers = snap.players.filter((p) => p.hand.length == 0);
        const isEmptyHandsForAllPlayers = emptyHandsPlayers.length == snap.players.length;
        const isDeckEmpty = snap.deck.length == 0;
        const isGameOver = (isEmptyHandsForAllPlayers && isDeckEmpty) || snap.players.length == 0;
        return isGameOver;
    }

    private isCurrentPlayerBrick(snap: MatchSnapshot<P>) {
        const numberOfPlayers = snap.players.length;

        const currentPlayerIndex = this.currentTurn % numberOfPlayers;
        const currentPlayer = snap.players[currentPlayerIndex];

        let isBrick = true;

        for (const card of currentPlayer.hand) {
            for (const targetPlayer of snap.players) {
                for (const targetPlayerField of targetPlayer.fields) {
                    for (const destinationPlayers of snap.players) {
                        for (const destinationField of destinationPlayers.fields) {
                            const validationResult = this.executePlayCard(snap, {
                                playerId: currentPlayer.player.id,
                                targetPlayerId: targetPlayer.player.id,
                                tagetPlayerFieldId: targetPlayerField.id,
                                cardType: card.type,
                                destinationPlayerFieldId: destinationField.id,
                            });
                            if (validationResult.result) {
                                isBrick = false;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return isBrick;
    }
}