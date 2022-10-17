import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { Log } from 'server/utils/console';

type CreateGameResponse = {};

export default async (req: NextApiRequest, res: NextApiResponse<CreateGameResponse>) => {
    switch(req.method) {
        case 'POST':
            const session = await getSession({ req });
            
            if (!session) {
                res.status(401).json({ message: "You must be logged in." });
                return;
            }
        
            Log('New game was created', 'info');
        
            return res.status(200).json({
                message: 'Success',
            });
        default:
            return res.status(404);
    }
}