import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/providers";
import {fetchRequestsThunk} from "../../../entities/request/model/thunks.ts";
import {RequestsTable} from "../../../widgets/requestsTable";

export function RequestsPage() {
    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector((state) => state.requests);

    const [statusFilter, setStatusFilter] = useState<string>('All');

    useEffect(() => {
        dispatch(fetchRequestsThunk());
    }, [dispatch]);


    const filteredRequests = useMemo(() => {
        if (statusFilter === 'All') return items;

        return items.filter((request) => request.status === statusFilter);
    }, [items, statusFilter]);


    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-6xl p-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Заявки на изменение лимита</h1>
                    <p className="text-gray-600">Просмотр и обработка заявок клиентов</p>
                </header>

                {isLoading && (
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="text-gray-700">Загрузка...</div>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="text-red-600">{error}</div>
                    </div>
                )}

                <div className="mb-4">
                    <label className="mr-2 text-sm text-gray-700">Статус:</label>
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="All">Все</option>
                        <option value="New">Новые</option>
                        <option value="Approved">Одобренные</option>
                        <option value="Rejected">Отклонённые</option>
                    </select>
                </div>

                {!isLoading && !error && <RequestsTable requests={filteredRequests} />}
            </div>
        </div>
    );
}
