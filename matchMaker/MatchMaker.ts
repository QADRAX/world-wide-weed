import { Player } from "../types/Player";

export type MatchMakerPlayerState  = 'none' | 'inqueue';

export interface MatchMakerOptions {
    checkInterval?: number;
    maxMatchSize?: number;
    minMatchSize?: number;
}

export type ResolverCallback<P> = (players: P[]) => void;
export type QueueResolverCallback<P> = () => Promise<P[]>;

export abstract class Matchmaker<P extends Player> {
    protected resolver?: ResolverCallback<P>;
    protected getKey = (player: P) => player.id;
    protected queueResolver: () => Promise<P[]>;

    protected checkInterval: number;
    protected maxMatchSize: number;
    protected minMatchSize: number;

    protected get queue(): () => Promise<P[]> {
        return this.queueResolver;
    }

    get playersInQueue(): number {
        return this.queue.length;
    }

    setResolver(resolver: ResolverCallback<P>) {
        this.resolver = resolver;
    }

    constructor(
        resolver: ResolverCallback<P>, 
        queueResolver: QueueResolverCallback<P>,
        options?: MatchMakerOptions
    ) {
        this.queueResolver = queueResolver;
        this.resolver = resolver;
        this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 5000;
        this.maxMatchSize = (options && options.maxMatchSize && options.maxMatchSize > 0 && options.maxMatchSize) || 2;
        this.minMatchSize = (options && options.minMatchSize && options.minMatchSize > 0 && options.minMatchSize) || this.maxMatchSize;
    }
}