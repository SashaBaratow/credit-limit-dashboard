import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {RequestsState} from './types';
import { fetchRequestsThunk, updateRequestThunk } from './thunks';



const initialState: RequestsState = {
    items: [],
    selectedId: null,
    isLoading: false,
    error: null,
};

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        selectRequest(state, action: PayloadAction<string | null>) {
            state.selectedId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchRequestsThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRequestsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchRequestsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? 'Failed to load requests';
            })

            // update
            .addCase(updateRequestThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(updateRequestThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex((request) => request.id === updated.id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
            })
            .addCase(updateRequestThunk.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to update request';
            });
    },
});

export const { selectRequest } = requestsSlice.actions;
export const requestsReducer = requestsSlice.reducer;
