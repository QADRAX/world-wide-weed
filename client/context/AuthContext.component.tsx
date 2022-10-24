import React, { useState, useEffect } from "react";
import nookies from "nookies";
import { firebaseClient } from "../firebaseClient";
import { AuthContext } from "./AuthContext";
import { UserInfo } from "../../types/UserInfo";

export type AuthProviderProps = {
  children: React.ReactNode;
  userInfo?: UserInfo;
}

export function AuthProvider(props: AuthProviderProps) {
  const [firebaseSessionUser, setFirebaseSessionUser] = useState<firebaseClient.User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(props.userInfo);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }
    return firebaseClient.auth().onIdTokenChanged(async (user) => {
      console.log(`token changed!`, user);
      if (!user) {
        console.log(`no token found...`);
        setFirebaseSessionUser(null);
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: '/' });
        return;
      }

      console.log(`updating token...`);
      const token = await user.getIdToken();
      setFirebaseSessionUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: '/' });
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`);
      const user = firebaseClient.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  const setUser = (userInfo: UserInfo) => setUserInfo(userInfo);

  return (
    <AuthContext.Provider value={{
      user: userInfo,
      firebaseSessionUser,
      setUser,
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

