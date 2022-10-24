import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';
import { GameController } from '../../../server/GameController';
import { Log } from '../../../utils/Log';

export type DeleteRoomRequest = {
    roomId: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: DeleteRoomRequest;
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const player = await getUserInfoFromRequest(req);
    const deleteRoomRequest = req.body;

    if (!deleteRoomRequest) {
        return res.status(400).json({ message: "Empty request" });
    }

    if (!player) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    if (player.userRoles.includes('roomAdmin')) {
        const controller = new GameController(player);
        const deleteRoomResult = await controller.deleteRoom(deleteRoomRequest);

        if (deleteRoomResult.errors.length > 0) {
            Log(`Controlled error(s) happened deleting '${deleteRoomRequest.roomId}': ${deleteRoomResult.errors.join()}`, 'warning');
            return res.status(400).json(deleteRoomResult.errors);
        } else {
            Log('Room was deleted', 'app');
            return res.status(200).json(deleteRoomResult.result);
        }
    } else {
        return res.status(403).json({ message: "You are not a room admin" });
    }
};