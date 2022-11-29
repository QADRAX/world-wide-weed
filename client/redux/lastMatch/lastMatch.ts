import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeedPlayer } from "../../../types/Player";
import { CardRequestSnapshot, PublicMatchSnapshot } from "../../../types/WeedTypes";

export type LastMatch = {
    players?: WeedPlayer[];
    publicSnapshots?: PublicMatchSnapshot[];
    cardRequestHistory?: CardRequestSnapshot[];
}

export type LastMatchSliceState = {
    lastMatch?: LastMatch;
};

export const initialState: LastMatchSliceState = {};

export const lastMatchSlice = createSlice({
    name: 'lastMatch',
    initialState,
    reducers: {
        setLastMatch: (state, action: PayloadAction<LastMatch | undefined>) => {
            state.lastMatch = action.payload;
        }
    }
});

export const { setLastMatch } = lastMatchSlice.actions;

export default lastMatchSlice.reducer;
