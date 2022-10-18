import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export type ReduxProviderProps = {
    children: React.ReactNode;
}

export const ReduxProvider: FunctionComponent<ReduxProviderProps> = (props) => {
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
};