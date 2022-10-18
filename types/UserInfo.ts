export type UserRole = 'admin' | 'matchAdmin';

export type WeedStats = {
    totalMatches: number;
    totalWins: number;
    totalSmokedPoints: number;
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