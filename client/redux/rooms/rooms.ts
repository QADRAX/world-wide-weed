import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeedRoom } from "../../../types/WeedTypes";
import { Dict } from "../../../utils/Dict";

export interface RoomsSliceState {
    currentRooms?: Dict<WeedRoom>,
    isLoading: boolean,
};

export const initialState: RoomsSliceState = {
    isLoading: false,
};

export type RoomActionPayload = {
    room: WeedRoom,
    roomId: string,
};

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRooms: (state, action: PayloadAction<Dict<WeedRoom> | undefined>) => {
            state.currentRooms = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setRooms, setIsLoading } = roomsSlice.actions;

export default roomsSlice.reducer;