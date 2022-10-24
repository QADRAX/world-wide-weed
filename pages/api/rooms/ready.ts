
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';
import { GameController } from '../../../server/GameController';
import { Log } from '../../../utils/Log';

export type ReadyToMatchRequest = {
    isReady: boolean;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: ReadyToMatchRequest;
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const readyToMatchRequest = req.body;

    if (!readyToMatchRequest) {
        return res.status(400).json({ message: "Empty request" });
    }

    const player = await getUserInfoFromRequest(req);

    if (!player) {
        return res.status(401).json({ message: "You must be logged in." });
    }

    if (player.userRoles.includes('playWeed')) {
        const controller = new GameController(player);

        const roomResult = readyToMatchRequest.isReady 
            ? await controller.readyToMatch()
            : await controller.undoReadyToMatch();

        if (roomResult.errors.length > 0) {
            Log(`Controlled error(s) happened setting ready for the match the player ${player.email}: ${roomResult.errors.join()}`, 'warning');
            return res.status(400).json(roomResult.errors);
        } else {
            Log(`Player ${player.email} set is ready ${readyToMatchRequest.isReady} for the a match`, 'app');
            return res.status(200).json(true);
        }
    } else {
        return res.status(403).json({ message: "You are banned to play weed" });
    }
};