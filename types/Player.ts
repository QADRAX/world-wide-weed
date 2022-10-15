export type Player = {
    id: string;
}

export interface WeedPlayer extends Player {
    name: string;
    email: string;
    isAdmin: boolean;
    avatarUrl?: string;
};

