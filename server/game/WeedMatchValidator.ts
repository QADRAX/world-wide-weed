import { ValidationResult } from "../../types/ValidationResult";
import { CardRequest, DiscardCardRequest, isPlayCardRequest, PlayCardRequest, PrivateMatchSnapshot as MatchSnapshot } from "../../types/WeedTypes";
import { getFieldValue } from "./fields";
import { WeedError } from "../../types/MatchErrors";

export class WeedMatchValidator {
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

    get players() {
        return this.currentSnapshot.players;
    }

    constructor(history: MatchSnapshot[]) {
        this.history = history;
    }

    public validatePlayCard(request: CardRequest): ValidationResult<WeedError, MatchSnapshot> {
        const validationResult = isPlayCardRequest(request)
            ? this.executePlayCard(this.currentSnapshot, request)
            : this.executeDiscardCard(this.currentSnapshot, request);

        return validationResult;
    }

    // PRIVATE METHODS

    private executePlayCard(
        snapshot: MatchSnapshot, 
        request: PlayCardRequest
    ): ValidationResult<WeedError, MatchSnapshot> {
        const result: ValidationResult<WeedError, MatchSnapshot> = {
            result: undefined,
            errors: [],
        };
        const snap = Object.assign({}, snapshot);
        const isGameOver = this.isGameOver(snap);
        if (isGameOver) {
            result.errors.push('GameOver');
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
                                                result.errors.push('ProtectedByDog');
                                            } else {
                                                if (targetField.value != 'dandileon') {
                                                    let availableEmptyTargetFields = targetPlayer.fields.filter((f) => f.value == 'empty');
                                                    if (isOwnTarget) {
                                                        availableEmptyTargetFields = availableEmptyTargetFields.filter((f) => f.protectedValue != 'dog');
                                                    }
                                                    if (targetField.value != 'empty' && availableEmptyTargetFields.length > 0) {
                                                        result.errors.push('CannotUpgradePlantIfEmptyFieldAvailable');
                                                    } else {
                                                        const targetFieldValue = getFieldValue(targetField.value);
                                                        if (harvestValue < targetFieldValue) {
                                                            result.errors.push('CannotPlantLessValueWeed');
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
                                                    result.errors.push('CannotPlantOverDandis');
                                                }
                                            }
                                        } else {
                                            result.errors.push('BustedField');
                                        }
                                    } else {
                                        result.errors.push('TargetFieldDoesNotExist');
                                    }
                                    break;

                                // Actionable Cards

                                case 'weedkiller':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog' && !isOwnTarget) {
                                                result.errors.push('ProtectedByDog');
                                            } else {
                                                if (targetField.value != 'empty') {
                                                    applyNextMove(() => {
                                                        targetField.value = 'empty';
                                                        targetField.valueOwnerId = undefined;
                                                    });
                                                } else {
                                                    result.errors.push('CannotKillEmptyFields');
                                                }
                                            }
                                        } else {
                                            result.errors.push('BustedField');
                                        }
                                    } else {
                                        result.errors.push('TargetFieldDoesNotExist');
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
                                            result.errors.push('CannotKillEmptyFields');
                                        }
                                    } else {
                                        result.errors.push('TargetFieldDoesNotExist');
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
                                                result.errors.push('CannotStealYourOwnFields');
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
                                                                result.errors.push('ProtectedField');
                                                            }

                                                        } else {
                                                            // Stealing a plant
                                                            if (targetField.value != 'empty') {
                                                                if (destinationField.protectedValue != 'busted') {
                                                                    const isOwnDestination = destinationPlayer.player.id == player.player.id;
                                                                    if (destinationField.protectedValue == 'dog' && !isOwnDestination) {
                                                                        result.errors.push('ProtectedByDog');
                                                                    } else {
                                                                        // replant logic
                                                                        if (destinationField.value != 'dandileon') {
                                                                            let availableEmptyTargetFields = destinationPlayer.fields.filter((f) => f.value == 'empty');
                                                                            if (isOwnDestination) {
                                                                                availableEmptyTargetFields = availableEmptyTargetFields.filter((f) => f.protectedValue != 'dog');
                                                                            }
                                                                            if (destinationField.value != 'empty' && availableEmptyTargetFields.length > 0) {
                                                                                result.errors.push('CannotUpgradePlantIfEmptyFieldAvailable');
                                                                            } else {
                                                                                const destinationFieldValue = getFieldValue(destinationField.value);
                                                                                const targetFieldValue = getFieldValue(targetField.value);
                                                                                if (targetFieldValue < destinationFieldValue) {
                                                                                    result.errors.push('CannotPlantLessValueWeed');
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
                                                                            result.errors.push('CannotPlantOverDandis');
                                                                        }
                                                                    }
                                                                } else {
                                                                    result.errors.push('BustedField');
                                                                }
                                                            } else {
                                                                result.errors.push('CannotStealEmptyFields');
                                                            }
                                                        }
                                                    } else {
                                                        result.errors.push('BustedField');
                                                    }
                                                } else {
                                                    result.errors.push('TargetFieldDoesNotExist');
                                                }
                                            }
                                        } else {
                                            result.errors.push('NoDestinationField');
                                        }
                                    } else {
                                        result.errors.push('NoDestinationField');
                                    }

                                    break;
                                case 'hippie':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog' && !isOwnTarget) {
                                                result.errors.push('ProtectedByDog');
                                            } else {
                                                if (targetField.value != 'empty' && targetField.value != 'dandeleon') {
                                                    applyNextMove(() => {
                                                        const harvestValue = getFieldValue(targetField.value);
                                                        targetField.value = 'empty';
                                                        targetField.valueOwnerId = undefined;
                                                        player.smokedScore += harvestValue;
                                                    });
                                                } else {
                                                    result.errors.push('HippieNeedsToSmokeSomething');
                                                }
                                            }
                                        } else {
                                            result.errors.push('BustedField');
                                        }
                                    } else {
                                        result.errors.push('TargetFieldDoesNotExist');
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
                                                result.errors.push('ProtectedByDog');
                                            } else {
                                                // Apply
                                                applyNextMove(() => {
                                                    targetField.protectedValue = 'busted';
                                                    targetField.protectedValueOwnerId = player.player.id;
                                                });
                                            }
                                        } else {
                                            result.errors.push('BustedField');
                                        }
                                    } else {
                                        result.errors.push('TargetFieldDoesNotExist');
                                    }

                                    break;

                                case 'dog':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog') {
                                                result.errors.push('ProtectedByDog');
                                            } else {
                                                if (targetField.value == 'empty' || targetField.value == 'dandeleon') {
                                                    result.errors.push('NotIlegalField');
                                                } else {
                                                    // Apply
                                                    applyNextMove(() => {
                                                        targetField.protectedValue = 'dog';
                                                        targetField.protectedValueOwnerId = player.player.id;
                                                    });
                                                }
                                            }
                                        } else {
                                            result.errors.push('BustedField');
                                        }
                                    } else {
                                        result.errors.push('TargetFieldDoesNotExist');
                                    }
                                    break;

                                default:
                                    result.errors.push('InvalidCardType');
                                    break;
                            }
                        } else {
                            result.errors.push('CardNotExistInPlayersHand');
                        }
                    } else {
                        result.errors.push('TargetPlayerNotInMatch');
                    }
                } else {
                    result.errors.push('NotPlayersTurn');
                }
            } else {
                result.errors.push('NotInMatch');
            }
        }

        return result;
    }

    private executeDiscardCard(
        snapshot: MatchSnapshot, 
        request: DiscardCardRequest
    ): ValidationResult<WeedError, MatchSnapshot> {
        const result: ValidationResult<WeedError, MatchSnapshot> = {
            result: undefined,
            errors: [],
        };
        const snap = Object.assign({}, snapshot);
        const isGameOver = this.isGameOver(snap);

        if (isGameOver) {
            result.errors.push('GameOver');
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
                            result.errors.push('IsNotBrick')
                        }
                    } else {
                        result.errors.push('CardNotExistInPlayersHand');
                    }
                } else {
                    result.errors.push('NotPlayersTurn');
                }

            } else {
                result.errors.push('NotInMatch');
            }
        }
        return result;
    }

    private isGameOver(snap: MatchSnapshot): boolean {
        const emptyHandsPlayers = snap.players.filter((p) => p.hand.length == 0);
        const isEmptyHandsForAllPlayers = emptyHandsPlayers.length == snap.players.length;
        const isDeckEmpty = snap.deck.length == 0;
        const isGameOver = (isEmptyHandsForAllPlayers && isDeckEmpty) || snap.players.length == 0;
        return isGameOver;
    }

    private isCurrentPlayerBrick(snap: MatchSnapshot): boolean {
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