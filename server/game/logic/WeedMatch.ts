import { ValidationResult } from "types/ValidationResult";
import { MatchErrors } from "types/weed/MatchErrors";
import { DiscardCardRequest, MatchSnapshot, PlayCardRequest } from "types/weed/WeedTypes";
import { getFieldValue } from "./WeedMatch.Fields";
/**
 * Weed Match instance
 */
export abstract class WeedMatch {
    history: MatchSnapshot[];

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

    constructor(initialSnapshot: MatchSnapshot) {
        this.history = [initialSnapshot];
    }

    public playCard(request: PlayCardRequest): ValidationResult<MatchErrors, MatchSnapshot> {
        const validationResult = this.executePlayCard(this.currentSnapshot, request);
        if(validationResult.result){
            this.history.push(validationResult.result);
        }
        return validationResult;
    }

    public discardCard(request: DiscardCardRequest): ValidationResult<MatchErrors, MatchSnapshot> {
        const validationResult = this.executeDiscardCard(this.currentSnapshot, request);
        if(validationResult.result){
            this.history.push(validationResult.result);
        }
        return validationResult;
    }

    /**
     * 
     * @param request 
     * @returns validation result of the play
     */
    private executePlayCard(snapshot: MatchSnapshot, request: PlayCardRequest): ValidationResult<MatchErrors, MatchSnapshot> {
        const result: ValidationResult<MatchErrors, MatchSnapshot> = {
            result: undefined,
            invalidReasons: [],
        };
        const snap = Object.assign({}, snapshot);
        const isGameOver = this.isGameOver(snap);
        if (isGameOver) {
            result.invalidReasons.push(MatchErrors.GameOver);
        } else {
            const numberOfPlayers = snap.players.length;

            const currentPlayerIndex = this.currentTurn % numberOfPlayers;
            const currentPlayer = snap.players[currentPlayerIndex];

            const nextPlayerIndex = (this.currentTurn + 1) % numberOfPlayers;
            const nextPlayer = snap.players[nextPlayerIndex];

            const player = snap.players.find((p) => p.playerId == request.playerId);
            if (player) {
                const isPlayersTurn = currentPlayer.playerId == request.playerId;
                if (isPlayersTurn) {
                    const targetPlayer = snap.players.find((p) => p.playerId == request.targetPlayerId);
                    if (targetPlayer) {
                        const currentPlayerHand = player.hand;
                        const currentCard = currentPlayerHand.find((c) => c.type == request.cardType);
                        if (currentCard) {

                            const isOwnTarget = targetPlayer.playerId == player.playerId;
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
                                                result.invalidReasons.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value != 'dandileon') {
                                                    let availableEmptyTargetFields = targetPlayer.fields.filter((f) => f.value == 'empty');
                                                    if (isOwnTarget) {
                                                        availableEmptyTargetFields = availableEmptyTargetFields.filter((f) => f.protectedValue != 'dog');
                                                    }
                                                    if (targetField.value != 'empty' && availableEmptyTargetFields.length > 0) {
                                                        result.invalidReasons.push(MatchErrors.CannotUpgradePlantIfEmptyFieldAvailable);
                                                    } else {
                                                        const targetFieldValue = getFieldValue(targetField.value);
                                                        if (harvestValue < targetFieldValue) {
                                                            result.invalidReasons.push(MatchErrors.CannotPlantLessValueWeed);
                                                        } else {
                                                            // APPLY
                                                            const nextValue = request.cardType;
                                                            applyNextMove(() => {
                                                                targetField.value = nextValue;
                                                                targetField.valueOwnerId = player.playerId;
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    result.invalidReasons.push(MatchErrors.CannotPlantOverDandis);
                                                }
                                            }
                                        } else {
                                            result.invalidReasons.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.invalidReasons.push(MatchErrors.TargetFieldDoesNotExist);
                                    }
                                    break;

                                // Actionable Cards

                                case 'weedkiller':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog' && !isOwnTarget) {
                                                result.invalidReasons.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value != 'empty') {
                                                    applyNextMove(() => {
                                                        targetField.value = 'empty';
                                                        targetField.valueOwnerId = undefined;
                                                    });
                                                } else {
                                                    result.invalidReasons.push(MatchErrors.CannotKillEmptyFields);
                                                }
                                            }
                                        } else {
                                            result.invalidReasons.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.invalidReasons.push(MatchErrors.TargetFieldDoesNotExist);
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
                                            result.invalidReasons.push(MatchErrors.CannotKillEmptyFields);
                                        }
                                    } else {
                                        result.invalidReasons.push(MatchErrors.TargetFieldDoesNotExist);
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
                                                result.invalidReasons.push(MatchErrors.CannotStealYourOwnFields);
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
                                                                result.invalidReasons.push(MatchErrors.ProtectedField);
                                                            }

                                                        } else {
                                                            // Stealing a plant
                                                            if (targetField.value != 'empty') {
                                                                if (destinationField.protectedValue != 'busted') {
                                                                    const isOwnDestination = destinationPlayer.playerId == player.playerId;
                                                                    if (destinationField.protectedValue == 'dog' && !isOwnDestination) {
                                                                        result.invalidReasons.push(MatchErrors.ProtectedByDog);
                                                                    } else {
                                                                        // replant logic
                                                                        if (destinationField.value != 'dandileon') {
                                                                            let availableEmptyTargetFields = destinationPlayer.fields.filter((f) => f.value == 'empty');
                                                                            if (isOwnDestination) {
                                                                                availableEmptyTargetFields = availableEmptyTargetFields.filter((f) => f.protectedValue != 'dog');
                                                                            }
                                                                            if (destinationField.value != 'empty' && availableEmptyTargetFields.length > 0) {
                                                                                result.invalidReasons.push(MatchErrors.CannotUpgradePlantIfEmptyFieldAvailable);
                                                                            } else {
                                                                                const destinationFieldValue = getFieldValue(destinationField.value);
                                                                                const targetFieldValue = getFieldValue(targetField.value);
                                                                                if (targetFieldValue < destinationFieldValue) {
                                                                                    result.invalidReasons.push(MatchErrors.CannotPlantLessValueWeed);
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
                                                                            result.invalidReasons.push(MatchErrors.CannotPlantOverDandis);
                                                                        }
                                                                    }
                                                                } else {
                                                                    result.invalidReasons.push(MatchErrors.BustedField);
                                                                }
                                                            } else {
                                                                result.invalidReasons.push(MatchErrors.CannotStealEmptyFields);
                                                            }
                                                        }
                                                    } else {
                                                        result.invalidReasons.push(MatchErrors.BustedField);
                                                    }
                                                } else {
                                                    result.invalidReasons.push(MatchErrors.TargetFieldDoesNotExist);
                                                }
                                            }
                                        } else {
                                            result.invalidReasons.push(MatchErrors.NoDestinationField);
                                        }
                                    } else {
                                        result.invalidReasons.push(MatchErrors.NoDestinationField);
                                    }

                                    break;
                                case 'hippie':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog' && !isOwnTarget) {
                                                result.invalidReasons.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value != 'empty' && targetField.value != 'dandileon') {
                                                    applyNextMove(() => {
                                                        const harvestValue = getFieldValue(targetField.value);
                                                        targetField.value = 'empty';
                                                        targetField.valueOwnerId = undefined;
                                                        player.smokedScore += harvestValue;
                                                    });
                                                } else {
                                                    result.invalidReasons.push(MatchErrors.HippieNeedsToSmokeSomething);
                                                }
                                            }
                                        } else {
                                            result.invalidReasons.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.invalidReasons.push(MatchErrors.TargetFieldDoesNotExist);
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
                                                result.invalidReasons.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                // Apply
                                                applyNextMove(() => {
                                                    targetField.protectedValue = 'busted';
                                                    targetField.protectedValueOwnerId = player.playerId;
                                                });
                                            }
                                        } else {
                                            result.invalidReasons.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.invalidReasons.push(MatchErrors.TargetFieldDoesNotExist);
                                    }

                                    break;

                                case 'dog':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog') {
                                                result.invalidReasons.push(MatchErrors.ProtectedByDog);
                                            } else {
                                                if (targetField.value == 'empty' || targetField.value == 'dandileon') {
                                                    result.invalidReasons.push(MatchErrors.NotIlegalField);
                                                } else {
                                                    // Apply
                                                    applyNextMove(() => {
                                                        targetField.protectedValue = 'dog';
                                                        targetField.protectedValueOwnerId = player.playerId;
                                                    });
                                                }
                                            }
                                        } else {
                                            result.invalidReasons.push(MatchErrors.BustedField);
                                        }
                                    } else {
                                        result.invalidReasons.push(MatchErrors.TargetFieldDoesNotExist);
                                    }
                                    break;

                                default:
                                    result.invalidReasons.push(MatchErrors.InvalidCardType);
                                    break;
                            }
                        } else {
                            result.invalidReasons.push(MatchErrors.CardNotExistInPlayersHand);
                        }
                    } else {
                        result.invalidReasons.push(MatchErrors.TargetPlayerNotInMatch);
                    }
                } else {
                    result.invalidReasons.push(MatchErrors.NotPlayersTurn);
                }
            } else {
                result.invalidReasons.push(MatchErrors.NotInMatch);
            }
        }

        return result;
    }

    private executeDiscardCard(snapshot: MatchSnapshot, request: DiscardCardRequest): ValidationResult<MatchErrors, MatchSnapshot> {
        const result: ValidationResult<MatchErrors, MatchSnapshot> = {
            result: undefined,
            invalidReasons: [],
        };
        const snap = Object.assign({}, snapshot);
        const isGameOver = this.isGameOver(snap);

        if (isGameOver) {
            result.invalidReasons.push(MatchErrors.GameOver);
        } else {
            const numberOfPlayers = snap.players.length;

            const currentPlayerIndex = this.currentTurn % numberOfPlayers;
            const currentPlayer = snap.players[currentPlayerIndex];

            const nextPlayerIndex = (this.currentTurn + 1) % numberOfPlayers;
            const nextPlayer = snap.players[nextPlayerIndex];

            const player = snap.players.find((p) => p.playerId == request.playerId);

            if (player) {

                const isPlayersTurn = currentPlayer.playerId == request.playerId;
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
                            result.invalidReasons.push(MatchErrors.IsNotBrick)
                        }
                    } else {
                        result.invalidReasons.push(MatchErrors.CardNotExistInPlayersHand);
                    }
                } else {
                    result.invalidReasons.push(MatchErrors.NotPlayersTurn);
                }

            } else {
                result.invalidReasons.push(MatchErrors.NotInMatch);
            }
        }
        return result;
    }

    private isGameOver(snap: MatchSnapshot) {
        const emptyHandsPlayers = snap.players.filter((p) => p.hand.length == 0);
        const isEmptyHandsForAllPlayers = emptyHandsPlayers.length == snap.players.length;
        const isDeckEmpty = snap.deck.length == 0;
        const isGameOver = (isEmptyHandsForAllPlayers && isDeckEmpty) || snap.players.length == 0;
        return isGameOver;
    }

    private isCurrentPlayerBrick(snap: MatchSnapshot) {
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
                                playerId: currentPlayer.playerId,
                                targetPlayerId: targetPlayer.playerId,
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