import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import passport from "passport";
import { Log } from '../../../utils/console';

export default (req: NextApiRequest, res: NextApiResponse) => {
    passport.authenticate('google', (err, user, info) => {
        if (err || !user) {
          return res.redirect('/?a=auth_fail');
        }

        Log(`Google auth callback message ${info.message}`, 'info');
    
        // set cookie and send redirect
        setCookie("token", user.token, {
          req,
          res,
        });
        res.redirect('/game');
    })(req, res);
};