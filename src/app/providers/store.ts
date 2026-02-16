import { configureStore } from '@reduxjs/toolkit';
import {requestsReducer} from "../../entities/request/model/requestsSlice.ts";

export const store = configureStore({
    reducer: {
        requests: requestsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
