export type ApplicationStatus = 'New' | 'Approved' | 'Rejected';

export type Currency = 'KGS' | 'RUB' | 'USD' | 'EUR';

export type RiskReason =
    | 'Недостаточно документов'
    | 'Низкий рейтинг'
    | 'Просрочки в прошлом'
    | 'Несоответствие данных'
    | 'Особый риск';

export interface ClientRequest {
    id: string;
    fullName: string;
    account: string;
    currentLimit: number;
    requestedLimit: number;
    currency: Currency;
    status: ApplicationStatus;
    approvedLimit?: number;
    reason?: RiskReason;
    updatedAt?: string;
}