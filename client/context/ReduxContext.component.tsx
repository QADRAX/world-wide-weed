import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export const ReduxProvider: FunctionComponent = (props) => {
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
};