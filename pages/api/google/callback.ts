import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import passport from "passport";

export default (req: NextApiRequest, res: NextApiResponse) => {
    passport.authenticate('google', (err, user, info) => {
        if (err || !user) {
          return res.redirect('/?a=auth_fail');
        }

        console.log(`Google auth callback message ${info.message}`)
    
        // set cookie and send redirect
        setCookie("token", user.token, {
          req,
          res,
        });
        res.redirect('/game');
    })(req, res);
};