import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './rooms/rooms';
import matchReducer from './match/match';
import lastMatchReducer from './lastMatch/lastMatch';

export const store = configureStore({
    reducer: {
        rooms: roomsReducer,
        match: matchReducer,
        lastMatch: lastMatchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
