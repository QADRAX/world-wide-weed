import { Player } from "types/Player";

export type MatchMakerPlayerState  = 'none' | 'inqueue';

export interface MatchMakerOptions {
    checkInterval?: number;
    maxMatchSize?: number;
    minMatchSize?: number;
}

export type ResolverCallback<P> = (players: P[]) => void;

export abstract class Matchmaker<P extends Player> {
    protected resolver?: ResolverCallback<P>;
    protected getKey = (player: P) => player.id;
    protected queue: P[];

    protected checkInterval: number;
    protected maxMatchSize: number;
    protected minMatchSize: number;

    get playersInQueue(): number {
        return this.queue.length;
    }

    setResolver(resolver: ResolverCallback<P>) {
        this.resolver = resolver;
    }

    constructor(options?: MatchMakerOptions) {
        this.queue = [];

        this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 5000;
        this.maxMatchSize = (options && options.maxMatchSize && options.maxMatchSize > 0 && options.maxMatchSize) || 2;
        this.minMatchSize = (options && options.minMatchSize && options.minMatchSize > 0 && options.minMatchSize) || this.maxMatchSize;
    }

    public push = (player: P): void => {
        if (this.indexOnQueue(player) != -1)
            throw Error('Player is already in queue');
        this.queue.push(player);
    }

    public getPlayerState(player: P): MatchMakerPlayerState {
        let playerKey = this.getKey(player);
        if (this.queue.find((queuePlayer: P) => playerKey == this.getKey(queuePlayer))) {
            return 'inqueue';
        }
        return 'none';
    }

    public leaveQueue(player: P): void {
        let index = this.indexOnQueue(player);
        if (index > -1) {
            this.queue.splice(index, 1);
        }
    }

    public indexOnQueue = (player: P): number => {
        const playerKey = this.getKey(player);
        const index = this.queue.findIndex((player) => { return this.getKey(player) == playerKey; });
        return index;
    }
}