import { NextApiRequest, NextApiResponse } from "next";
import { getUserInfoFromRequest } from "../../../server/authentication";
import { GameController } from "../../../server/GameController";
import { PlayCardRequest } from "../../../types/WeedTypes";
import { Log } from "../../../utils/Log";

interface ExtendedNextApiRequest extends NextApiRequest {
    body: PlayCardRequest;
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            const player = await getUserInfoFromRequest(req);
            const playCardRequest = req.body;

            if (!playCardRequest) {
                return res.status(400);
            }

            if (!player) {
                return res.status(401).json({ message: "You must be logged in." });
            }

            if (player.userRoles.includes('playWeed')) {
                const controller = new GameController(player);
                const roomResult = await controller.playCard(playCardRequest);

                if(roomResult.errors.length > 0) {
                    Log(`Controlled error(s) happened with ${player.email} trying to play a card: ${roomResult.errors.join()}`, 'warning');
                    return res.status(400).json(roomResult.errors);
                } else {
                    Log(`Player ${player.email} discarded a card`, 'app');
                    return res.status(200).json(true);
                }
            } else {
                return res.status(403).json({ message: "You are banned to play weed" });
            }
        default:
            return res.status(404);
    }
}