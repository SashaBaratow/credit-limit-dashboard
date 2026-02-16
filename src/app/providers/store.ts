import { configureStore } from '@reduxjs/toolkit';
import {requestsReducer} from "../../entities/request/model/requestsSlice.ts";
import {sessionLogReducer} from "../../entities/sessionLog/model/sessionLogSlice.ts";

export const store = configureStore({
    reducer: {
        requests: requestsReducer,
        sessionLog: sessionLogReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
