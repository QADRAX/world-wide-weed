import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';
import { GameController } from '../../../server/GameController';
import { Log } from '../../../utils/Log';

export type RestartRoomRequest = {
    roomId: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: RestartRoomRequest;
}

const Restart = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const player = await getUserInfoFromRequest(req);
    const restartRoomRequest = req.body;

    if (!restartRoomRequest) {
        return res.status(400).json({ message: "Empty request" });
    }

    if (!player) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    if (player.userRoles.includes('roomAdmin')) {
        const controller = new GameController(player);
        const restartRoomResult = await controller.restartRoom(restartRoomRequest);

        if (restartRoomResult.errors.length > 0) {
            Log(`Controlled error(s) happened restarting the room '${restartRoomRequest.roomId}': ${restartRoomResult.errors.join()}`, 'warning');
            return res.status(400).json(restartRoomResult.errors);
        } else {
            Log('Room was restarted', 'app');
            return res.status(200).json(restartRoomResult.result);
        }
    } else {
        return res.status(403).json({ message: "You are not a room admin" });
    }
};

export default Restart;