import { NextApiRequest } from "next";
import nookies from "nookies";
import { DEFAULT_USER_AVATAR } from "../shared/constants";
import { WeedPlayer } from "../types/Player";
import { firebaseAdmin } from "./firebaseAdmin";

export async function getPlayerFromRequest(
    req: NextApiRequest
): Promise<WeedPlayer | undefined> {
    let result: WeedPlayer | undefined = undefined;
    try {
        const cookies = nookies.get({ req });
        const auth = firebaseAdmin.auth();
        
        const token = await auth.verifyIdToken(cookies.token);
        const user = await auth.getUser(token.uid);

        const isAdmin = (user.customClaims && user.customClaims['admin'] == true) ?? false;

        const userEmail = user.email!;

        result = {
            id: user.uid,
            name: user.displayName ?? userEmail,
            email: userEmail,
            avatarUrl: user.photoURL ?? DEFAULT_USER_AVATAR,
            isAdmin: isAdmin,
        };
    } catch(error) {
        console.log(error);
    };

    return result;
}