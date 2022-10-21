
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
        const roomResult = await controller.readyToMatch();

        if (roomResult.errors.length > 0) {
            Log(`Controlled error(s) happened setting ready for the match the player ${player.email}: ${roomResult.errors.join()}`, 'warning');
            return res.status(400).json(roomResult.errors);
        } else {
            Log(`Player ${player.email} is ready for the a new match`, 'app');
            return res.status(200).json(true);
        }
    } else {
        return res.status(403).json({ message: "You are banned to play weed" });
    }
};