import { GetServerSidePropsContext, NextApiRequest } from "next";
import nookies from "nookies";
import { DEFAULT_USER_AVATAR } from "../../shared/constants";
import { UserInfo } from "../../types/UserInfo";
import { firebaseAdmin } from "../firebaseAdmin";

export async function getUserFromPropsContext(
    ctx: GetServerSidePropsContext
): Promise<UserInfo | undefined> {
    const cookies = nookies.get(ctx);
    return getUserInfoFromToken(cookies.token);
}

export function getUserInfoFromRequest(
    req: NextApiRequest
): Promise<UserInfo | undefined> {
    const cookies = nookies.get({ req });
    return getUserInfoFromToken(cookies.token);
}

export async function getUserInfoFromToken(
    token: string
): Promise<UserInfo | undefined> {
    let result: UserInfo | undefined = undefined;
    try {
        const auth = firebaseAdmin.auth();
        const verifiedToken = await auth.verifyIdToken(token);
        const user = await auth.getUser(verifiedToken.uid);
        result = await getOrCreateUserInfo(user);
    } catch(error) {
        console.log(error);
    };

    return result;
}

async function getOrCreateUserInfo(user: firebaseAdmin.auth.UserRecord): Promise<UserInfo> {
    const firestore = firebaseAdmin.firestore();
    const collection = firestore.collection('users');
    const docRef = collection.doc(user.uid);
    const doc = await docRef.get();
    if(doc.exists) {
        const userInfo = doc.data() as UserInfo;
        return userInfo;
    } else {
        const userEmail = user.email!; // is defined
        const newUser: UserInfo = {
            id: user.uid,
            displayName: user.displayName ?? userEmail,
            name: user.displayName ?? userEmail,
            email: userEmail,
            avatarUrl: user.photoURL ?? DEFAULT_USER_AVATAR,
            userRoles: [
                'playWeed',
                'chat',
            ],
            stats: {
                totalMatches: 0,
                totalSmokedPoints: 0,
                totalWins: 0,
            }
        };
        await docRef.set(newUser);
        return newUser;
    }
}