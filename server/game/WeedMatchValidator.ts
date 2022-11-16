import { ValidationResult } from "../../types/ValidationResult";
import { CardRequest, DiscardCardRequest, isPlayCardRequest, PlayCardRequest, PrivateMatchPlayer, PrivateMatchSnapshot as MatchSnapshot } from "../../types/WeedTypes";
import { getFieldValue } from "./fields";
import { WeedError } from "../../types/MatchErrors";
import structuredClone from '@ungap/structured-clone';
import { WeedPlayer } from "../../types/Player";

export class WeedMatchValidator {
    history: MatchSnapshot[];
    players: WeedPlayer[];

    get currentTurn() {
        return this.history.length - 1;
    }

    get currentSnapshot() {
        return this.history[this.currentTurn];
    }

    get deckSike() {
        return this.currentSnapshot.deck?.length ?? 0;
    }

    get gameOver() {
        return this.isGameOver(this.currentSnapshot);
    }

    get currentPlayer() {
        const numberOfPlayers = this.currentSnapshot.players.length;

        const currentPlayerIndex = this.currentTurn % numberOfPlayers;
        const currentPlayer = this.currentSnapshot.players[currentPlayerIndex];

        return currentPlayer;
    }

    get isCurrentPlayerBriked() {
        return this.isPlayerBrick(this.currentPlayer, this.currentSnapshot);
    }

    constructor(history: MatchSnapshot[] | undefined, players: WeedPlayer[]) {
        this.history = history || [];
        this.players = players;
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
        const snap = structuredClone(snapshot);
        const isGameOver = this.isGameOver(snap);
        if (isGameOver) {
            result.errors.push('GameOver');
        } else {
            const numberOfPlayers = snap.players.length;

            const currentPlayerIndex = this.currentTurn % numberOfPlayers;
            const currentWeedPlayer = this.players[currentPlayerIndex];
            const currentPlayer = snap.players.find((p) => p.playerId == currentWeedPlayer.id);

            const nextPlayerIndex = (this.currentTurn + 1) % numberOfPlayers;
            const nextWeedPlayer = this.players[nextPlayerIndex];
            const nextPlayer = snap.players.find((p) => p.playerId == nextWeedPlayer.id);

            const player = snap.players.find((p) => p.playerId == request.playerId);
            if (player && currentPlayer && nextPlayer) {
                const isPlayersTurn = currentPlayer.playerId == request.playerId;
                if (isPlayersTurn) {
                    const targetPlayer = snap.players.find((p) => p.playerId == request.targetPlayerId);
                    if (targetPlayer) {
                        const currentPlayerHand = player.hand ?? [];
                        const currentCard = currentPlayerHand.find((c) => c.type == request.cardType);
                        if (currentCard) {

                            const isOwnTarget = targetPlayer.playerId == player.playerId;
                            const targetField = targetPlayer.fields.find((f) => f.id == request.targetFieldId);

                            const applyDiscard = () => {
                                const currentCardIndex = player.hand?.indexOf(currentCard);
                                player.hand?.splice(currentCardIndex!, 1);
                                if (!snap.discards) {
                                    snap.discards = [];
                                }
                                snap.discards.push(currentCard);
                            };

                            const applyNextPlayerDraw = () => {
                                const handSize = nextPlayer.hand?.length ?? 0;
                                const numberOfFields = nextPlayer.fields.length


                                if (handSize < numberOfFields && (snap.deck?.length ?? 0) > 0) {
                                    const nextCard = snap.deck?.pop();
                                    if (nextCard) {
                                        nextPlayer.hand?.push(nextCard);
                                    }
                                }
                            };

                            /**
                             * Apply next play 
                             * @param applyCardLogic 
                             */
                            const applyNextMove = (applyCardLogic: () => void) => {
                                applyDiscard();
                                applyCardLogic();
                                applyNextPlayerDraw();
                                result.result = snap;
                            }

                            switch (request.cardType) {

                                // Harvasteable Cards

                                case 'dandeleon':
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
                                                if (targetField.value != 'dandeleon') {
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
                                                                targetField.valueOwnerId = player.playerId;
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
                                                        targetField.valueOwnerId = '';
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
                                                    targetField.protectedValueOwnerId = '';
                                                } else {
                                                    targetField.value = 'empty';
                                                    targetField.valueOwnerId = '';
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
                                    const destinationFieldId = request.destinationFieldId;
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
                                                                    const isOwnDestination = destinationPlayer.playerId == player.playerId;
                                                                    if (destinationField.protectedValue == 'dog' && !isOwnDestination) {
                                                                        result.errors.push('ProtectedByDog');
                                                                    } else {
                                                                        // replant logic
                                                                        if (destinationField.value != 'dandeleon') {
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
                                                                                        targetField.valueOwnerId = '';

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
                                                        targetField.valueOwnerId = '';
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
                                                field.protectedValueOwnerId = '';
                                            } else {
                                                field.value = 'empty';
                                                field.valueOwnerId = '';
                                            }
                                        });
                                    });
                                    break;

                                // Protectable Cards

                                case 'dog':
                                    if (targetField) {
                                        if (targetField.protectedValue != 'busted') {
                                            if (targetField.protectedValue == 'dog') {
                                                result.errors.push('ProtectedByDog');
                                            } else {
                                                // Apply
                                                applyNextMove(() => {
                                                    targetField.protectedValue = 'dog';
                                                    targetField.protectedValueOwnerId = player.playerId;
                                                });
                                            }
                                        } else {
                                            result.errors.push('BustedField');
                                        }
                                    } else {
                                        result.errors.push('TargetFieldDoesNotExist');
                                    }

                                    break;

                                case 'busted':
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
                                                        targetField.protectedValue = 'busted';
                                                        targetField.protectedValueOwnerId = player.playerId;
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
        const snap = structuredClone(snapshot);
        const isGameOver = this.isGameOver(snap);

        if (isGameOver) {
            result.errors.push('GameOver');
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
                    const currentCard = currentPlayerHand?.find((c) => c.type == request.cardType);
                    if (currentCard) {
                        const isBrick = this.isPlayerBrick(player, snap);
                        if (isBrick) {
                            const applyDiscard = () => {
                                const currentCardIndex = player.hand?.indexOf(currentCard);
                                player.hand?.splice(currentCardIndex!, 1);
                                if(!snap.discards){
                                    snap.discards = [];
                                }
                                snap.discards.push(currentCard);
                            };
                            const applyNextPlayerDraw = () => {
                                const handSize = nextPlayer.hand?.length;
                                const numberOfFields = nextPlayer.fields.length

                                if (handSize! < numberOfFields) {
                                    const nextCard = snap.deck?.pop();
                                    if (nextCard) {
                                        nextPlayer.hand?.push(nextCard);
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
        const currentTurn = this.currentTurn + 1;

        const discardSize = snap.discards?.length ?? 0;
        const carsInHands = snap.players.reduce((acc, player) => acc + (player.hand?.length ?? 0), 0) ?? 0;
        const deckSize = snap.deck?.length ?? 0;
        const total = deckSize + discardSize + carsInHands;
        const isGameOver = currentTurn > total;

        return isGameOver;
    }

    private isPlayerBrick(player: PrivateMatchPlayer, snap: MatchSnapshot): boolean {
        let isBrick = true;
        const playerHand = player.hand ?? [];
        for (const card of playerHand) {
            for (const targetPlayer of snap.players) {
                for (const targetPlayerField of targetPlayer.fields) {
                    for (const destinationPlayers of snap.players) {
                        for (const destinationField of destinationPlayers.fields) {
                            const validationResult = this.executePlayCard(snap, {
                                playerId: player.playerId,
                                targetPlayerId: targetPlayer.playerId,
                                targetFieldId: targetPlayerField.id,
                                cardType: card.type,
                                destinationFieldId: destinationField.id,
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