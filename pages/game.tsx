import { GetServerSideProps } from 'next';
import { getCookie, deleteCookie } from "cookies-next";
import { getUserByToken } from "../server/auth/jwt";
import { WeedPlayer } from "../server/types/Player";
import { GlobalContextComponent } from "context/GlobalContext.component";
import { WeedMainScreen } from 'components/WeedMainScreen';

type GameProps = {
    player: WeedPlayer;
    token: string,
}

export default function Game(props: GameProps) {
    return (
        <GlobalContextComponent player={props.player} token={props.token}>
            <WeedMainScreen />
        </GlobalContextComponent>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        // check cookie
        const token = getCookie("token", { req, res })?.toString();
        if (!token) {
            return {
                redirect: {
                    statusCode: 302,
                    destination: "/",
                },
            };
        } else {
            const existingUser = await getUserByToken(token);
            if (!existingUser)
                return {
                    redirect: {
                        statusCode: 302,
                        destination: "/",
                    },
                };
            return {
                props: {
                    player: {
                        id: existingUser.id,
                        name: existingUser.name,
                        email: existingUser.email,
                        isAdmin: existingUser.isAdmin,
                        avatarUrl: existingUser.avatarUrl,
                    },
                    token: existingUser.token,
                },
            };
        }
    } catch (err) {
        deleteCookie("token", { req, res });
        return {
            redirect: {
                statusCode: 302,
                destination: "/",
            },
        };
    }
}