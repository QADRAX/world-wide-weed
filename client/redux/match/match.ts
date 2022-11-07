import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeedPlayer } from "../../../types/Player";
import { PlayCardRequest, ProtectedMatchSnapshot, PublicMatchSnapshot } from "../../../types/WeedTypes";
import { GameService } from "../../services/GameService";

export type MatchSliceState = {
    // GENERAL LOADER STATE

    isLoading: boolean;

    // MATCH INFO

    players: WeedPlayer[];
    isCurrentPlayerBriked: boolean;
    publicSnapshots: PublicMatchSnapshot[] | undefined;
    protectedSnapshots: ProtectedMatchSnapshot[] | undefined;

    // CURRENT SELECTION

    selectedCardId?: string;
    targetPlayerId?: string;
    tagetFieldId?: string;
    destinationFieldId?: string;
};

export const initialState: MatchSliceState = {
    isLoading: false,
    players: [],
    isCurrentPlayerBriked: false,
    publicSnapshots: [],
    protectedSnapshots: [],
};

export const playCardAction = createAsyncThunk('match/playCard',
    async (request: PlayCardRequest) => {
        await GameService.playCard(request);
    });

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
        setTargetPlayerId: (state, action: PayloadAction<string | undefined>) => {
            state.targetPlayerId = action.payload;
        },
        setSelectedCardId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedCardId = action.payload;
        },
        setTargetFieldId: (state, action: PayloadAction<string | undefined>) => {
            state.tagetFieldId = action.payload;
        },
        setDestinationFieldId: (state, action: PayloadAction<string | undefined>) => {
            state.destinationFieldId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(playCardAction.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(playCardAction.fulfilled, (state) => {
            state.isLoading = false;
            state.destinationFieldId = undefined;
            state.selectedCardId = undefined;
            state.tagetFieldId = undefined;
            state.targetPlayerId = undefined;
        });
        builder.addCase(playCardAction.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {
    setPublicSnapshots,
    setProtectedSnapshots,
    setIsLoading,
    setIsCurrentPlayerBriked,
    setMatchPlayers,
    setDestinationFieldId,
    setTargetFieldId,
    setSelectedCardId,
    setTargetPlayerId,
} = matchSlice.actions;

export default matchSlice.reducer;
