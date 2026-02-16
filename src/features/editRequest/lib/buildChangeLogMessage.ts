import type { ClientRequest, RiskReason, ApplicationStatus } from '../../../entities/request/model/types';

type UpdatePayload = {
    status: ApplicationStatus;
    approvedLimit?: number;
    reason?: RiskReason;
};

export function buildChangeLogMessage(prev: ClientRequest, next: UpdatePayload): string[] {
    const messages: string[] = [];

    if (prev.status !== next.status) {
        messages.push(`Статус: ${prev.status} → ${next.status}`);
    }

    if (next.approvedLimit !== undefined && prev.approvedLimit !== next.approvedLimit) {
        messages.push(`Лимит: ${String(prev.approvedLimit ?? '—')} → ${String(next.approvedLimit)}`);
    }

    if (next.reason !== undefined && prev.reason !== next.reason) {
        messages.push(`Причина: ${String(prev.reason ?? '—')} → ${String(next.reason)}`);
    }

    if (messages.length === 0) {
        messages.push('Изменений нет');
    }

    return messages;
}
