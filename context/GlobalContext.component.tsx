import { FunctionComponent } from "react";
import { ReduxContextComponent } from "./ReduxContext.Component";

export type GlobalContextProps = {
    children?: React.ReactNode;
}

export const GlobalContextComponent: FunctionComponent<GlobalContextProps> = (props) => {
    return (
        <ReduxContextComponent>
            {props.children}
        </ReduxContextComponent>
    );
}