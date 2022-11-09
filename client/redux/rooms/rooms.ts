import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../../../types/ChatMessage";
import { WeedRoom } from "../../../types/WeedTypes";
import { Dict } from "../../../utils/Dict";

export interface RoomsSliceState {
    currentRooms?: Dict<WeedRoom>,
    currentChatMessages?: ChatMessage[],
    isLoading: boolean,
    textMessage: string,
    isPostingMessage: boolean,
};

export const initialState: RoomsSliceState = {
    isLoading: false,
    textMessage: '',
    isPostingMessage: false,
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
        setChatMessages: (state, action: PayloadAction<ChatMessage[] | undefined>) => {
            state.currentChatMessages = action.payload;
        },
        setTextMessage: (state, action: PayloadAction<string>) => {
            state.textMessage = action.payload;
        },
        setIsPostingMessage: (state, action: PayloadAction<boolean>) => {
            state.isPostingMessage = action.payload;
        },
    },
});

export const { setRooms, setIsLoading, setChatMessages, setTextMessage, setIsPostingMessage } = roomsSlice.actions;

export default roomsSlice.reducer;