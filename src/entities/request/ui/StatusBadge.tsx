import type { ApplicationStatus } from '../model/types.ts';

type StatusBadgeProps = {
    status: ApplicationStatus;
};

const statusLabel: Record<ApplicationStatus, string> = {
    New: 'Новая',
    Approved: 'Одобрена',
    Rejected: 'Отклонена',
};

const statusClasses: Record<ApplicationStatus, string> = {
    New: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    Approved: 'bg-green-50 text-green-700 ring-green-600/20',
    Rejected: 'bg-red-50 text-red-700 ring-red-600/20',
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={[
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                statusClasses[status],
            ].join(' ')}
        >
      {statusLabel[status]}
    </span>
    );
}
