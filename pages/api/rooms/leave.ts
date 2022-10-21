
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';
import { GameController } from '../../../server/GameController';
import { Log } from '../../../utils/Log';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const player = await getUserInfoFromRequest(req);

    if (!player) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    if (player.userRoles.includes('playWeed')) {
        const controller = new GameController(player);
        const result = await controller.leaveRoom();

        if (result.errors.length > 0) {
            Log(`Controlled error(s) happened setting leaving player current room: ${result.errors.join()}`, 'warning');
            return res.status(400).json(result.errors);
        } else {
            Log(`Player ${player.email} is leaving is room`, 'app');
            return res.status(200);
        }
    } else {
        return res.status(403).json({ message: "You are banned to play weed" });
    }
};