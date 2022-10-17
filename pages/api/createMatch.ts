import { NextApiRequest, NextApiResponse } from 'next';
import { getPlayerFromRequest } from '../../server/authentication';
import { createWeedMatch } from '../../server/weedMatches';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const player = await getPlayerFromRequest(req);

    if (!player) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }

    const matchId = await createWeedMatch(player);
    console.log('New match was created');

    return res.status(200).json({
        matchId,
    });
};