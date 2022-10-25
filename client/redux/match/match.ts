import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeedPlayer } from "../../../types/Player";
import { ProtectedMatchSnapshot, PublicMatchSnapshot } from "../../../types/WeedTypes";

export type MatchSliceState = {
    isLoading: boolean;
    players: WeedPlayer[];
    isCurrentPlayerBriked: boolean;
    publicSnapshots: PublicMatchSnapshot[];
    protectedSnapshots: ProtectedMatchSnapshot[];
};

export const initialState: MatchSliceState = {
    isLoading: true,
    players: [],
    isCurrentPlayerBriked: false,
    publicSnapshots: [],
    protectedSnapshots: [],
};

export const matchSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
        setPublicSnapshots: (state, action: PayloadAction<PublicMatchSnapshot[]>) => {
            state.publicSnapshots = action.payload;
        },
        setProtectedSnapshots: (state, action: PayloadAction<ProtectedMatchSnapshot[]>) => {
            state.protectedSnapshots = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsCurrentPlayerBriked: (state, action: PayloadAction<boolean>) => {
            state.isCurrentPlayerBriked = action.payload;
        },
        setMatchPlayers: (state, action: PayloadAction<WeedPlayer[]>) => {
            state.players = action.payload;
        },
    },
});

export const { setPublicSnapshots, setProtectedSnapshots, setIsLoading, setIsCurrentPlayerBriked, setMatchPlayers } = matchSlice.actions;

export default matchSlice.reducer;
