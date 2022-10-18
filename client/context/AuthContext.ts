import { createContext } from "react";
import { UserInfo } from "../../types/UserInfo";
import { firebaseClient } from "../firebaseClient";

export type AuthContextState = {
    user?: UserInfo;
    firebaseSessionUser: firebaseClient.User | null;
    setUser: (user: UserInfo) => void;
}

export const AuthContext = createContext<AuthContextState>({
    firebaseSessionUser: null,
    setUser: () => {},
});