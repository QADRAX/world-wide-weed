import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBUser } from "server/db/model/User";

export type PlayerConnections = {
    [socketId: string]: {
        player: DBUser;
    }
};

export const initialConnectionState: PlayerConnections = {};

export type AddPlayerConnection = {
    player: DBUser;
    socketId: string;
}

export const connectionsSlice = createSlice({
    name: 'connections',
    initialState: initialConnectionState,
    reducers: {
        addPlayer: (state, action: PayloadAction<AddPlayerConnection>) => {
            state[action.payload.socketId] = {
                player: action.payload.player,
            };
        },
        deletePlayer: (state, action: PayloadAction<string>) => {
            delete state[action.payload];
        },
    }
});

export const { addPlayer, deletePlayer } = connectionsSlice.actions;

export const serverStore = configureStore({
    reducer: {
        connections: connectionsSlice.reducer,
    },
});

export type ServerRootState = ReturnType<typeof serverStore.getState>;

export type ServerAppDispatch = typeof serverStore.dispatch;