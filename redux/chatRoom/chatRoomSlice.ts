import { ChatMessage } from "../../types/ChatMessage";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ResponseChatMessagePayload } from "../../types/SocketMessages";
import { WeedPlayer } from "types/Player";

export interface ChatRoom {
    messages: ChatMessage[];
}

export interface ChatRooms {
    [roomKey: string]: ChatRoom;
}

export interface ChatState {
    currentPlayers: WeedPlayer[];
    chatRooms: ChatRooms;
    currentChatRoom: string;
}

export const initialChatState: ChatState = {
    currentPlayers: [],
    chatRooms: {
        general: {
            messages: [],
        },
    },
    currentChatRoom: 'general',
};

export const chatRoomSlice = createSlice({
    name: 'ChatRooms',
    initialState: initialChatState,
    reducers: {
        setPlayers: (state, action: PayloadAction<WeedPlayer[]>) => {
            state.currentPlayers = action.payload;
        },
        addMessage: (state, action: PayloadAction<ResponseChatMessagePayload>) => {
            const targetRoomKey = action.payload.roomId;
            let room = state.chatRooms[targetRoomKey];
            if(!room){
                room = {
                    messages: [],
                };
            }
            room.messages.push(action.payload.chatMessage);
        },
        changeChatRoom: (state, action: PayloadAction<string>) => {
            state.currentChatRoom = action.payload;
        },
    }
});

export const { addMessage, setPlayers, changeChatRoom } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;