
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';
import { GameController } from '../../../server/GameController';
import { Log } from '../../../utils/Log';

export type JoinRoomRequest = {
    roomId: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: JoinRoomRequest;
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            const player = await getUserInfoFromRequest(req);
            const joinRoomRequest = req.body;

            if (!joinRoomRequest) {
                return res.status(400);
            }

            if (!player) {
                res.status(401).json({ message: "You must be logged in." });
                return;
            }

            if (player.userRoles.includes('playWeed')) {
                const controller = new GameController(player);
                const roomResult = await controller.joinRoom(joinRoomRequest);

                if(roomResult.errors.length > 0) {
                    Log(`Controlled error(s) happened during room join: ${roomResult.errors.join()}`, 'warning');
                    return res.status(400).json(roomResult.errors);
                } else {
                    Log(`Player ${player.email} joined to the room ${joinRoomRequest.roomId}`, 'app');
                    return res.status(200);
                }
            } else {
                return res.status(403).json({ message: "You are banned to play weed" });
            }

        default:
            return res.status(404);
    }
};