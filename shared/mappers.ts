import { WeedPlayer } from "../types/Player";
import { UserInfo } from "../types/UserInfo";

export function toWeedPlayer(user: UserInfo): WeedPlayer {
    return {
        id: user.id,
        name: user.displayName,
        avatarUrl: user.avatarUrl,
        isAdmin: user.userRoles.includes('admin'),
        email: user.email,
    }
}
