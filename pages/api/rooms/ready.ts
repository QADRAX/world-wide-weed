
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/repository/authenticationRepository';
import { getWeedRoom } from '../../../server/repository/roomRepository';

export type ReadyToMatchRequest = {
    roomId: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: ReadyToMatchRequest;
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
                res.status(401).json({ message: "You must be logged in." });
                return;
            }

            const room = await getWeedRoom(req.body.roomId)
            

        default:
            return res.status(404);
    }
};