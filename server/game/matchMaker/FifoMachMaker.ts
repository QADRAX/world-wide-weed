import { Player } from "types/Player";
import { MatchMakerOptions, Matchmaker } from "./MatchMaker";

interface IFifoMatchMakerOptions extends MatchMakerOptions { }

export class FifoMatchmaker<P extends Player> extends Matchmaker<P> {
	constructor(options?: IFifoMatchMakerOptions) {
		super(options);
		setInterval(this.FifoMatch, this.checkInterval);
	}

	private FifoMatch = (): void => {
		let players: P[];
		while (this.queue.length >= this.minMatchSize) {
			players = [];
			while (this.queue.length > 0 && players.length < this.maxMatchSize) {
				players.push(this.queue.pop() as P);
			}
			if(this.resolver){
				this.resolver(players);
			}
		}
	}

}