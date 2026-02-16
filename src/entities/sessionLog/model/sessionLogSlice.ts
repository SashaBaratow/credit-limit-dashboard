import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type { SessionLogEntry } from './types';

type SessionLogState = {
    items: SessionLogEntry[];
};

const initialState: SessionLogState = {
    items: [],
};

const sessionLogSlice = createSlice({
    name: 'sessionLog',
    initialState,
    reducers: {
        addLog(state, action: PayloadAction<SessionLogEntry>) {
            state.items.unshift(action.payload);
        },
        clearLogs(state) {
            state.items = [];
        },
    },
});

export const { addLog, clearLogs } = sessionLogSlice.actions;
export const sessionLogReducer = sessionLogSlice.reducer;
