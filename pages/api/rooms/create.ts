import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';
import { GameController } from '../../../server/GameController';
import { Log } from '../../../utils/Log';

export type CreateRoomRequest = {
    roomName: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: CreateRoomRequest;
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            const player = await getUserInfoFromRequest(req);
            const createMatchRequest = req.body;

            if (!createMatchRequest) {
                return res.status(400);
            }

            if (!player) {
                return res.status(401).json({ message: "You must be logged in." });
            }

            if (player.userRoles.includes('roomAdmin')) {
                const controller = new GameController(player);
                const roomResult = await controller.createRoom(createMatchRequest);

                if(roomResult.errors.length > 0) {
                    Log(`Controlled error(s) happened during room creation: ${roomResult.errors.join()}`, 'warning');
                    return res.status(400).json(roomResult.errors);
                } else {
                    Log('Room was created', 'app');
                    return res.status(200);
                }
            } else {
                return res.status(403).json({ message: "You are not a room admin" });
            }

        default:
            return res.status(404);
    }


};