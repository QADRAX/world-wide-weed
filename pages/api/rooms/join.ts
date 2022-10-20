
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../../server/authentication';

export type JoinMatchRequest = {
    matchId: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: JoinMatchRequest;
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            const player = await getUserInfoFromRequest(req);
            const joinMatchRequest = req.body;

            if (!joinMatchRequest) {
                return res.status(400);
            }

            if (!player) {
                res.status(401).json({ message: "You must be logged in." });
                return;
            }

            if (player.userRoles.includes('playWeed')) {
                //const matchId = await createRoom(createMatchRequest.roomName);
                console.log('New match was created');

                return res.status(200).json({
                    matchId,
                });
            } else {
                return res.status(403).json({ message: "You are not a room admin" });
            }
            

        default:
            return res.status(404);
    }
};