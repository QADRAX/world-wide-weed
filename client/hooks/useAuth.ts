import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuthenticatedUser = () => {
  const { user: userInfo } = useContext(AuthContext);
  if (userInfo) {
    return { user: userInfo };
  } else {
    throw new Error('You need to be authenticated');
  }
};

export const useAuth = () => {
  return useContext(AuthContext);
};
