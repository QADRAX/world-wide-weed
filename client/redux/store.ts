import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './rooms/rooms';
import matchReducer from './match/match';

export const store = configureStore({
    reducer: {
        rooms: roomsReducer,
        match: matchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
