import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MatchesDict, OngoingWeedMatch } from "../../../types/weed/WeedTypes";

export interface OngoingMatchesState {
    matches: MatchesDict,
};

export const initialState: OngoingMatchesState = {
    matches: {}
};

export type OngoingMatchActionPayload = {
    match: OngoingWeedMatch,
    matchId: string,
};

export const ongoingMatchesSlice = createSlice({
    name: 'ongoingMatches',
    initialState,
    reducers: {
        setOngoingMatches: (state, action: PayloadAction<MatchesDict>) => {
            state.matches = action.payload;
        },
        addUpdateOngoingMatch: (state, action: PayloadAction<OngoingMatchActionPayload>) => {
            state.matches[action.payload.matchId] = action.payload.match;
        },
        deleteOngoingMatch: (state, action: PayloadAction<string>) => {
            delete state.matches[action.payload];
        },
    },
});

export const { setOngoingMatches, addUpdateOngoingMatch, deleteOngoingMatch } = ongoingMatchesSlice.actions;

export default ongoingMatchesSlice.reducer;