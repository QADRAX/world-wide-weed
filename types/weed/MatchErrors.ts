export enum MatchErrors {
    /**
     * The match is already done
     */
    GameOver,
    /**
     * Player is not in match
     */
    NotInMatch,
    /**
     * It's not the player's turn yet.
     */
    NotPlayersTurn,
    /**
     * Target player is not in match
     */
    TargetPlayerNotInMatch,
    /**
     * The player does not have this card in hand
     */
    CardNotExistInPlayersHand,
    /**
     * Invalid card type
     */
    InvalidCardType,
    /**
     * Target field does not exist
     */
    TargetFieldDoesNotExist,
    /**
     * It is not possible to access busted fields
     */
    BustedField,
    /**
     * Field is protected by dog
     */
    ProtectedByDog,
    /**
     * Cannot plant over dandileons
     */
    CannotPlantOverDandis,
    /**
     * Cannot upgrade plant if emptyfField are available
     */
    CannotUpgradePlantIfEmptyFieldAvailable,
    /**
     * Cannot plant less value weed
     */
    CannotPlantLessValueWeed,
    /**
     * Cannoy kill empty fields
     */
    CannotKillEmptyFields,
    HippieNeedsToSmokeSomething,
    NotIlegalField,
    NoDestinationField,
    CannotStealYourOwnFields,
    CannotStealEmptyFields,
    ProtectedField,
    IsNotBrick
}
