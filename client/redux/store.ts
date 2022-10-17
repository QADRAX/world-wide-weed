import { configureStore } from '@reduxjs/toolkit';
import ongoingMatchesReducer from './currentMatches/currentMatches';

export const store = configureStore({
    reducer: {
        ongoingMatches: ongoingMatchesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
