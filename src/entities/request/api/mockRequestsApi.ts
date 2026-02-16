import type { ClientRequest, RiskReason, ApplicationStatus } from '../model/types';
import type {UpdateRequestPayload} from "../model/types.ts";

const MIN_LIMIT = 0;
const MAX_LIMIT = 10_000_000;

const NETWORK_DELAY_MS = 500;

let requestsDb: ClientRequest[] = [
    {
        id: '7b2f-4a12',
        fullName: 'Иванов Иван Иванович',
        account: '40817810500000001234',
        currentLimit: 50_000,
        requestedLimit: 150_000,
        currency: 'KGS',
        status: 'New',
    },
    {
        id: '1c9d-8b34',
        fullName: 'Константинопольский Александр Владимирович"',
        account: '40817810500000005678',
        currentLimit: 1_500_000,
        requestedLimit: 2000000,
        currency: 'KGS',
        status: 'Approved',
        approvedLimit: 900_000,
        reason: 'Низкий рейтинг',
        updatedAt: new Date().toISOString(),
    },
    {
        id: '9a5e-2f11',
        fullName: 'Сидорова Анна Сергеевна',
        account: '40817840300000009999',
        currentLimit: 100_000,
        requestedLimit: 0,
        currency: 'KGS',
        status: 'Rejected',
        reason: 'Недостаточно документов',
        updatedAt: new Date().toISOString(),
    },
];

function assertLimitIsValid(limit: number) {
    if (!Number.isFinite(limit)) throw new Error('Limit must be a finite number');
    if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
        throw new Error(`Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`);
    }
}

export function getRequests(): Promise<ClientRequest[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(requestsDb);
        }, NETWORK_DELAY_MS);
    });
}


export function updateRequest(payload: UpdateRequestPayload): Promise<ClientRequest> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const requestIndex = requestsDb.findIndex(
                (request) => request.id === payload.id
            );

            if (requestIndex === -1) {
                reject(new Error('Request not found'));
                return;
            }

            const currentRequest = requestsDb[requestIndex];

            if (payload.approvedLimit !== undefined) {
                try {
                    assertLimitIsValid(payload.approvedLimit);
                } catch (error) {
                    reject(error);
                    return;
                }
            }

            const updatedRequest: ClientRequest = {
                ...currentRequest,
                status: payload.status,
                approvedLimit:
                    payload.approvedLimit !== undefined
                        ? payload.approvedLimit
                        : currentRequest.approvedLimit,
                reason:
                    payload.reason !== undefined
                        ? payload.reason
                        : currentRequest.reason,
                updatedAt: new Date().toISOString(),
            };

            requestsDb[requestIndex] = updatedRequest;

            resolve(updatedRequest);
        }, NETWORK_DELAY_MS);
    });
}