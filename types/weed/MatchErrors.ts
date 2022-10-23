export type WeedError = 
    | 'CannotUndoReadyDuringMatch'
    | 'PlayerNotReady'
    /**
     * Caanot leave the room if the player is ready for the match
     */
    | 'CannotLeaveRoomIfPlayerReady'
    /**
     * Cannot leave the room during a match
     */
    | 'CannotLeaveRoomDuringMatch'
    /** 
     * The match not exists
     */
    | 'MatchNotExists'
    /**
     * Player is in any room
     */
    | 'PlayerNotInAnyRoom'
    /**
     * Room with same name
     */
    | 'SameRoomName'
    /**
     * Player is already in room
     */
    | 'PlayerAlreadyInRoom'
    /**
     * Player is already ready for the match
     */
    | 'PlayerAlreadyReady'
    /**
     * The match is already done
     */
    | 'GameOver'
    /**
     * Player is not in match
     */
    | 'NotInMatch'
    /**
     * It's not the player's turn yet.
     */
    | 'NotPlayersTurn'
    /**
     * Target player is not in match
     */
    | 'TargetPlayerNotInMatch'
    /**
     * The player does not have this card in hand
     */
    | 'CardNotExistInPlayersHand'
    /**
     * Invalid card type
     */
    | 'InvalidCardType'
    /**
     * Target field does not exist
     */
    | 'TargetFieldDoesNotExist'
    /**
     * It is not possible to access busted fields
     */
    | 'BustedField'
    /**
     * Field is protected by dog
     */
    | 'ProtectedByDog'
    /**
     * Cannot plant over dandileons
     */
    | 'CannotPlantOverDandis'
    /**
     * Cannot upgrade plant if emptyfField are available
     */
    | 'CannotUpgradePlantIfEmptyFieldAvailable'
    /**
     * Cannot plant less value weed
     */
    | 'CannotPlantLessValueWeed'
    /**
     * Cannoy kill empty fields
     */
    | 'CannotKillEmptyFields'
    /**
     * Hippie needs to smoke something
     */
    | 'HippieNeedsToSmokeSomething'
    /**
     * Dandis are not ilegal
     */
    | 'NotIlegalField'
    /**
     * No destination field
     */
    | 'NoDestinationField'
    /**
     * Cannot steal your own fields
     */
    | 'CannotStealYourOwnFields'
    /**
     * Cannot steal empty fields
     */
    | 'CannotStealEmptyFields'
    /**
     * This field is protected
     */
    | 'ProtectedField'
    /**
     * You only can discard a card if you are briked
     */
    | 'IsNotBrick'
    /**
     * The room Doesn't exists
     */
    | "RoomNotExists";
