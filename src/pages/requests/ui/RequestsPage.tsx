import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/providers";
import {fetchRequestsThunk} from "../../../entities/request/model/thunks.ts";
import {RequestsTable} from "../../../widgets/requestsTable";
import {Select} from "../../../shared/ui/select";

type StatusFilterValue = 'All' | 'New' | 'Approved' | 'Rejected';

const statusOptions: { value: StatusFilterValue; label: string }[] = [
    { value: 'All', label: 'Все' },
    { value: 'New', label: 'Новые' },
    { value: 'Approved', label: 'Одобренные' },
    { value: 'Rejected', label: 'Отклонённые' },
];

export function RequestsPage() {
    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector((state) => state.requests);

    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('All');

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

                <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-gray-700">Статус:</span>

                    <Select
                        value={statusFilter}
                        options={statusOptions}
                        onChange={setStatusFilter}
                        ariaLabel="Фильтр по статусу"
                    />
                </div>

                {!isLoading && !error && <RequestsTable requests={filteredRequests} />}
            </div>
        </div>
    );
}
