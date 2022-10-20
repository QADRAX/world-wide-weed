import { CreateRoomRequest } from "../pages/api/rooms/create";
import { JoinMatchRequest } from "../pages/api/rooms/join";
import { ReadyToMatchRequest } from "../pages/api/rooms/ready";
import { ValidationResult } from "../types/ValidationResult";
import { WeedError } from "../types/weed/MatchErrors";
import { WeedRoom } from "../types/weed/WeedTypes";

export interface IGameController {
    /**
     * Creates a weed room
     * @param request 
     * @returns roomId
     */
    createRoom(request: CreateRoomRequest): Promise<ValidationResult<WeedError, WeedRoom>>;

    /**
     * Join player to room
     * @param request 
     * @returns roomId
     */
    joinRoom(request: JoinMatchRequest): Promise<ValidationResult<WeedError, WeedRoom>>;

    /**
     * Set a player ready for the weed match
     * @param request 
     * @returns roomId
     */
    readyToMatch(request: ReadyToMatchRequest): Promise<ValidationResult<WeedError, WeedRoom>>;
}