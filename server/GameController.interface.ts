import { CreateRoomRequest } from "../pages/api/rooms/create";
import { JoinRoomRequest } from "../pages/api/rooms/join";
import { ValidationResult } from "../types/ValidationResult";
import { WeedError } from "../types/MatchErrors";
import { WeedRoom } from "../types/WeedTypes";
import { DeleteRoomRequest } from "../pages/api/rooms/delete";

export interface IGameController {
    /**
     * Creates a weed room
     * @param request 
     * @returns roomId
     */
    createRoom(request: CreateRoomRequest): Promise<ValidationResult<WeedError, WeedRoom>>;

    /**
     * Deletes a weed room
     * @param request
     * @returns true if room was deleted
     */
    deleteRoom(request: DeleteRoomRequest): Promise<ValidationResult<WeedError, boolean>>

    /**
     * Join player to room
     * @param request 
     * @returns roomId
     */
    joinRoom(request: JoinRoomRequest): Promise<ValidationResult<WeedError, WeedRoom>>;

    /**
     * Leave room
     */
    leaveRoom(): Promise<ValidationResult<WeedError, WeedRoom>>;

    /**
     * Set a player not ready
     */
    undoReadyToMatch(): Promise<ValidationResult<WeedError, WeedRoom>>;

    /**
     * Set ready to match
     */
    readyToMatch(): Promise<ValidationResult<WeedError, WeedRoom>>;

    /**
     * Sends a message to the room
     * @param message 
     */
    postChatMessage(message: string): Promise<ValidationResult<WeedError, boolean>>;
}