import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/providers";
import {fetchRequestsThunk, updateRequestThunk} from "../../../entities/request/model/thunks.ts";
import {RequestsTable} from "../../../widgets/requestsTable";
import {Select} from "../../../shared/ui/select";
import {Input} from "../../../shared/ui/Input";
import {useDebouncedValue} from "../../../shared/lib/useDebouncedValue.ts";
import {selectRequest} from "../../../entities/request/model/requestsSlice.ts";
import {EditRequestModal} from "../../../features/editRequest/ui/EditRequestModal.tsx";
import {SessionLogPanel} from "../../../widgets/sessionLog";
import {buildChangeLogMessage} from "../../../features/editRequest/lib/buildChangeLogMessage.ts";
import {addLog} from "../../../entities/sessionLog/model/sessionLogSlice.ts";

type StatusFilterValue = 'All' | 'New' | 'Approved' | 'Rejected';

const statusOptions: { value: StatusFilterValue; label: string }[] = [
    { value: 'All', label: 'Все' },
    { value: 'New', label: 'Новые' },
    { value: 'Approved', label: 'Одобренные' },
    { value: 'Rejected', label: 'Отклонённые' },
];

export function RequestsPage() {
    const dispatch = useAppDispatch();
    const { items, isLoading, error, selectedId } = useAppSelector((state) => state.requests);

    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);



    useEffect(() => {
        dispatch(fetchRequestsThunk());
    }, [dispatch]);


    const filteredRequests = useMemo(() => {
        return items
            .filter((request) => {
                if (statusFilter !== 'All' && request.status !== statusFilter) {
                    return false;
                }

                if (!debouncedSearchQuery.trim()) {
                    return true;
                }

                return request.fullName
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase());
            });
    }, [items, statusFilter, debouncedSearchQuery]);

    const selectedRequest = useMemo(() => {
        if (!selectedId) return null;
        return items.find((request) => request.id === selectedId) ?? null;
    }, [items, selectedId]);


    return (

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <div className=" bg-gray-100">
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

                        <div className="mb-4 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-700">Статус:</span>

                            <Select
                                value={statusFilter}
                                options={statusOptions}
                                onChange={setStatusFilter}
                                ariaLabel="Фильтр по статусу"
                            />
                            <div>
                                <Input
                                    placeholder="Поиск по ФИО"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                />
                            </div>
                        </div>

                        {!isLoading && !error &&
                            <RequestsTable
                                requests={filteredRequests}
                                onRowClick={(id) => {
                                    setSaveError(null);
                                    dispatch(selectRequest(id));
                                }}
                            />}
                    </div>

                    <EditRequestModal
                        key={selectedRequest?.id ?? 'empty'}
                        isOpen={selectedId !== null}
                        request={selectedRequest}
                        isSaving={isSaving}
                        saveError={saveError}
                        onClose={() => {
                            setSaveError(null);
                            dispatch(selectRequest(null));
                        }}
                        onSave={async (payload) => {
                            try {
                                setSaveError(null);
                                setIsSaving(true);
                                await dispatch(updateRequestThunk(payload)).unwrap();
                                const prev = selectedRequest;
                                if (prev) {
                                    const lines = buildChangeLogMessage(prev, payload);

                                    lines.forEach((line) => {
                                        dispatch(
                                            addLog({
                                                id: crypto.randomUUID(),
                                                timestamp: new Date().toISOString(),
                                                message: `${prev.fullName}: ${line}`,
                                            })
                                        );
                                    });
                                }
                                dispatch(selectRequest(null));
                            } catch (e) {
                                const message = e instanceof Error ? e.message : 'Ошибка сохранения';
                                setSaveError(message);
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                    />
                </div>
            </div>

            <div className="lg:col-span-1">
                <SessionLogPanel />
            </div>
        </div>
    );
}
