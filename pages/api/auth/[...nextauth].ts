import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google';
import { getAppConfig } from "server/AppConfig";
import { connectToMongo } from "server/db/dataBase";
import User from "server/db/model/User";
import { Log } from "server/utils/console";
import { v4 as uuidv4 } from 'uuid';

export const getAuthOptions = () => {
    const config = getAppConfig();
    const options: NextAuthOptions = {
        providers: [
            GoogleProvider({
                clientId: config.GOOGLE_CLIENT_ID,
                clientSecret: config.GOOGLE_CLIENT_SECRET,
            }),
        ],
        session: {
            strategy: 'jwt',
        },
        callbacks: {
            session({ session }) {
                return session;
            },
            signIn: async ({ profile }) => {
                try {
                    await connectToMongo();
                    const userEmail = profile?.email;
                    const userName = profile?.name;
                    if (userEmail && userName) {
                        const existingUser = await User.findOne({ email: profile.email });
                        if (!existingUser) {
                            // create new user
                            const newUser = new User({
                                id: uuidv4(),
                                email: userEmail,
                                name: userName,
                                isAdmin: false,
                                avatarUrl: profile.image,
                            });
                            await newUser.save();
                            Log(`Auth successful for NEW User ${profile.email}`);
                            return true;
                        } else {
                            existingUser.avatarUrl = profile.image;
                            await existingUser.save();
                            Log(`Auth successful for existing user ${profile.email}`);
                            return true;
                        }
                    } else {
                        return false;
                    }

                } catch (err) {
                    console.error(err);
                    return false;
                }
            },
        }
    }
    return options;
}

export default NextAuth(getAuthOptions())