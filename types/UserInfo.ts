import { WeedMatch } from "./WeedTypes";

export type UserRole = 
    /**
     * Role to administrate users and roles
     */
    |'admin'
    /**
     * Role to create and destroy rooms
     */
    | 'roomAdmin'
    /**
     * Role to write in chats
     */
    | 'chat'
    /**
     * Role to play games
     */
    | 'playWeed'

export type WeedStats = {
    totalMatches: number;
    totalWins: number;
    totalSmokedPoints: number;
}

export type UserMatchInfo = {
    date: number;
    match: WeedMatch;
}

export type UserMatchesInfo = {
    matches: UserMatchInfo[];
}

export type UserInfo = {
    id: string;
    name: string;
    displayName: string;
    email: string;
    avatarUrl: string;
    userRoles: UserRole[],
    stats: WeedStats;
}