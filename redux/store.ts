import { configureStore } from '@reduxjs/toolkit'
import chatRoomSlice from './chatRoom/chatRoomSlice'

export const store = configureStore({
    reducer: {
        chat: chatRoomSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
