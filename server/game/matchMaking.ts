import { FifoMatchmaker } from 'matchmaking';
import { DBUser } from '../db/model/User';
import * as socketio from 'socket.io';

export class MatchMaking {
    private io: socketio.Server;
    private fifoMatchmaker: FifoMatchmaker<DBUser>;

    constructor(io: socketio.Server) {
        this.io = io;
        this.fifoMatchmaker = new FifoMatchmaker();
    }

    matchR


}