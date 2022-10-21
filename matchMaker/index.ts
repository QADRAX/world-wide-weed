import { firebaseAdmin } from "../server/firebaseAdmin";
import { WeedRoom } from "../types/weed/WeedTypes";
import { Log } from "../utils/Log";
import dotenv from "dotenv";
import { Dict, toArray } from "../utils/Dict";

dotenv.config();

const database = firebaseAdmin.database();

Log('Runnin Weed Match Maker', 'app');

(async () => {
    const roomsRef = database.ref('/rooms');
    const snap = await roomsRef.once('value');
    const roomsDict = snap.val() as Dict<WeedRoom> | undefined;
    const rooms = toArray(roomsDict);

    console.log(rooms);
})();
