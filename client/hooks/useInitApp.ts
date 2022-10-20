import { useEffect } from "react";
import { WeedRoomsDict } from "../../types/weed/WeedTypes";
import { firebaseClient } from "../firebaseClient";
import { setOngoingMatches } from "../redux/currentMatches/currentMatches";
import { useAppDispatch } from "./redux";

export const useInitApp = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            const database = firebaseClient.database();
            const matchesRef = database.ref('/ongoingMatches');
            const snap = await matchesRef.once('value');
            const ongoingMatches = snap.val() as WeedRoomsDict | undefined;

            dispatch(setOngoingMatches(ongoingMatches ?? {}));

            matchesRef.on('value', (snap) => {
                const match = snap.val() as WeedRoomsDict;
                dispatch(setOngoingMatches(match));
                console.log('Matches update');
            });
        })()
    }, []);
};
