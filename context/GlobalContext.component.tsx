import { FunctionComponent } from "react";
import { WeedPlayer } from "server/types/Player";
import { AppContextComponent } from "./AppContext.Component";
import { ReduxContextComponent } from "./ReduxContext.Component";
import { SocketContextComponent } from "./SocketContext.Component";

export type GlobalContextProps = {
    token: string;
    player: WeedPlayer;
    children?: React.ReactNode;
}

export const GlobalContextComponent: FunctionComponent<GlobalContextProps> = (props) => {
    return (
        <ReduxContextComponent>
            <SocketContextComponent token={props.token}>
                <AppContextComponent token={props.token} player={props.player}>
                    {props.children}
                </AppContextComponent>
            </SocketContextComponent>
        </ReduxContextComponent>
    );
}