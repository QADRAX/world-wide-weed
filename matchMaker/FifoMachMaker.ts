import { Player } from "../types/Player";
import { MatchMakerOptions, Matchmaker, ResolverCallback, QueueResolverCallback } from "./MatchMaker";

interface IFifoMatchMakerOptions extends MatchMakerOptions { }

export class FifoMatchmaker<P extends Player> extends Matchmaker<P> {
	constructor(
		resolver: ResolverCallback<P>,
		queueResolver: QueueResolverCallback<P>,
		options?: IFifoMatchMakerOptions,
	) {
		super(resolver, queueResolver, options);
		setInterval(this.FifoMatch, this.checkInterval);
	}

	private FifoMatch = async (): Promise<void> => {
		let players: P[];
		const nextQueue = await this.queue();
		while (nextQueue.length >= this.minMatchSize) {
			players = [];
			while (nextQueue.length > 0 && players.length < this.maxMatchSize) {
				players.push(nextQueue.pop() as P);
			}
			if(this.resolver){
				this.resolver(players);
			}
		}
	}

}