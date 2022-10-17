import { createContext } from "react";
import { firebaseClient } from "../firebaseClient";

export const AuthContext = createContext<{ user: firebaseClient.User | null }>({
    user: null,
});