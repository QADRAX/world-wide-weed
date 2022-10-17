import { NextApiRequest } from "next";
import nookies from "nookies";
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

        result = {
            id: user.uid,
            name: user.displayName!,
            email: user.email!,
            avatarUrl: user.photoURL,
            isAdmin: isAdmin,
        };
    } catch(error) {
        console.log(error);
    };

    return result;
}