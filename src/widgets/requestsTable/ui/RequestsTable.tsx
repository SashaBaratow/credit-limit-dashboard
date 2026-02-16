import type {RequestsTableProps} from "../model/types.ts";
import {maskAccount} from "../../../shared/lib/maskAccount.ts";
import {StatusBadge} from "../../../entities/request/ui";


export function RequestsTable({ requests, onRowClick }: RequestsTableProps) {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow">
            <div className="border-b px-6 py-4">
                <div className="text-lg font-semibold text-gray-900">Список заявок</div>
                <div className="text-sm text-gray-600">Всего: {requests.length}</div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50 text-left text-sm text-gray-600">
                    <tr>
                        <th className="px-6 py-3 font-medium">ФИО</th>
                        <th className="px-6 py-3 font-medium">Счёт</th>
                        <th className="px-6 py-3 font-medium">Текущий лимит</th>
                        <th className="px-6 py-3 font-medium">Запрошенный лимит</th>
                        <th className="px-6 py-3 font-medium">Статус</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y text-sm text-gray-800">
                    {requests.map((request) => (
                        <tr
                            key={request.id}
                            onClick={() => onRowClick(request.id)}
                            className="hover:bg-gray-50 cursor-pointer">
                            <td className="px-6 py-4">{request.fullName}</td>
                            <td className="px-6 py-4 font-mono text-xs text-gray-700"> {maskAccount(request.account)}</td>
                            <td className="px-6 py-4">
                                {request.currentLimit.toLocaleString()} {request.currency}
                            </td>
                            <td className="px-6 py-4">
                                {request.requestedLimit.toLocaleString()} {request.currency}
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={request.status} />
                            </td>
                        </tr>
                    ))}

                    {requests.length === 0 && (
                        <tr>
                            <td className="px-6 py-10 text-center text-gray-500" colSpan={5}>
                                Нет заявок
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
