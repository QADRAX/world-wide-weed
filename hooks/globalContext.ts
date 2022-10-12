import { AppContext } from "context/AppContext";
import { useContext } from "react";

export const useAppContext = () => useContext(AppContext);