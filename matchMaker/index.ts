import { firebaseAdmin } from "../server/firebaseAdmin";
import { WeedRoomsDict } from "../types/weed/WeedTypes";
import { Log } from "../utils/Log";
import dotenv from "dotenv";

dotenv.config();

const database = firebaseAdmin.database();

Log('Runnin Weed Match Maker', 'app');

(async () => {
    const matchesRef = database.ref('/ongoingMatches');
    const snap = await matchesRef.once('value');
    const ongoingMatches = snap.val() as WeedRoomsDict | undefined;
    const matches = Object.values(ongoingMatches ?? {});

    console.log(matches);

})();
