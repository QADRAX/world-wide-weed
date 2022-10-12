import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { store } from "redux/store";

export type ReduxContextProps = {
    children?: React.ReactNode;
}

export const ReduxContextComponent: FunctionComponent<ReduxContextProps> = (props) => {
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
};