import { Strategy, StrategyOptionsWithRequest, VerifyCallback } from "passport-google-oauth2";
import User from "../db/model/User";
import { getAppConfig } from "../AppConfig";
import { getToken } from "./jwt";
import { v4 as uuidv4 } from 'uuid';

const verifyLogin = (
    _request: any,
    accessToken: string, 
    _refreshToken: string, 
    profile: any, 
    done: VerifyCallback
) => {
    (async () => {
        try {
            const existingUser = await User.findOne({ email: profile.email });
            if (!existingUser) {
                // create new user
                const newUser = new User({
                    id: uuidv4(),
                    email: profile.email,
                    name: profile.displayName,
                    accessToken,
                    isAdmin: false,
                    avatarUrl: profile.picture,
                });
                await newUser.save();
                const token = getToken(newUser);
                newUser.token = token;
                await newUser.save();
                done(null, newUser, { message: `Auth successful for NEW User ${profile.email}` });
            } else {
                // login existing user
                const token = getToken(existingUser);
                existingUser.token = token;
                existingUser.avatarUrl = profile.picture;
                await existingUser.save();
                done(null, existingUser, { message: `Auth successful for existing user ${profile.email}` });
            }
        } catch (err) {
            console.error(err);
            done(err, false, { message: "Internal server error" });
        }
    })();
}

export const getGoogleStrategy = () => {
    const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = getAppConfig();

    const strategyOptions: StrategyOptionsWithRequest = {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/google/callback",
        passReqToCallback: true,
    };

    const googleStrategy = new Strategy(
        strategyOptions,
        verifyLogin,
    );
    
    return googleStrategy;
}
