import { DBUser } from "server/db/model/User";
import { MAX_PLAYERS_IN_MATCH, MIN_PLAYERS_IN_MATCH } from "./GameConstants";
import { ConnectionHub } from "./logic/ConnectionHub";
import { FifoMatchmaker } from "./logic/FifoMachMaker";

export const AppConnectionHub = new ConnectionHub();
export const AppMatchMaker = new FifoMatchmaker<DBUser>({
    checkInterval: 8000,
    maxMatchSize: MAX_PLAYERS_IN_MATCH,
    minMatchSize: MIN_PLAYERS_IN_MATCH,
});