import { getAppConfig } from "../AppConfig";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { DBUser } from "../db/model/User";
import { WeedPlayer } from "../../types/Player";

export const getToken = (user: DBUser): string => {
    const { JWT_SECRET } = getAppConfig();
    const created = Date.now().toString();
    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            created,
        },
        JWT_SECRET
    );
    return token;
}

export const getWeedPlayerByToken = (token: string) => {
    const { JWT_SECRET } = getAppConfig();
    const verified = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const weedPlayer: WeedPlayer = {
        id: verified.id,
        name: verified.name,
        email: verified.email,
        isAdmin: verified.isAdmin,
    };
    return weedPlayer;
}

export const getUserByToken = async (token: string) => {
    const player = getWeedPlayerByToken(token);
    const existingUser = player
        ? await User.findOne({ id: player.id }) as DBUser | null
        : null
    return existingUser;
}
