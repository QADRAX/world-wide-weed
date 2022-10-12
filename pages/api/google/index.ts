import type { NextApiRequest, NextApiResponse } from 'next';
import passport from "passport";

export default (req: NextApiRequest, res: NextApiResponse, next: any) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })(req, res, next);
};