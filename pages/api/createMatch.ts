import { NextApiRequest, NextApiResponse } from 'next';
import { getUserInfoFromRequest } from '../../server/authentication';
import { toWeedPlayer } from '../../server/mappers';
import { createMatch, getPlayerMatch } from '../../server/weedMatches';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const player = await getUserInfoFromRequest(req);

    if (!player) {
        res.status(401).json({ message: "You must be logged in." });
        return;
    }
    const match = await getPlayerMatch(player.id);
    if(match) {
        return res.status(400).json({ message: `You are already in the match ${match.id}`})
    }

    const matchId = await createMatch(toWeedPlayer(player), `${player.name}'s match`);
    console.log('New match was created');

    return res.status(200).json({
        matchId,
    });
};