import { createAsyncThunk } from '@reduxjs/toolkit';
import type {ClientRequest, UpdateRequestPayload} from './types';
import {getRequests, updateRequest} from "../api/mockRequestsApi.ts";

export const fetchRequestsThunk = createAsyncThunk<ClientRequest[]>(
    'requests/fetchAll',
    async () => {
        return await getRequests();
    }
);

export const updateRequestThunk = createAsyncThunk<ClientRequest, UpdateRequestPayload>(
    'requests/update',
    async (payload) => {
        return await updateRequest(payload);
    }
);
