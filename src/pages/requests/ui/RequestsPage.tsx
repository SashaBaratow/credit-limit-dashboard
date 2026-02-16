import { useEffect } from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/providers";
import {fetchRequestsThunk} from "../../../entities/request/model/thunks.ts";
import {RequestsTable} from "../../../widgets/requestsTable";

export function RequestsPage() {
    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector((state) => state.requests);

    useEffect(() => {
        dispatch(fetchRequestsThunk());
    }, [dispatch]);

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

                {!isLoading && !error && <RequestsTable requests={items} />}
            </div>
        </div>
    );
}
