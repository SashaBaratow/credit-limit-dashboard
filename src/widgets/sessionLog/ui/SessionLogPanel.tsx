import { clearLogs } from '../../../entities/sessionLog/model/sessionLogSlice';
import {useAppDispatch, useAppSelector} from "../../../app/providers";

export function SessionLogPanel() {
    const dispatch = useAppDispatch();
    const logs = useAppSelector((state) => state.sessionLog.items);

    return (
        <div className="rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <div className="text-lg font-semibold text-gray-900">Session log</div>
                    <div className="text-sm text-gray-600">История изменений (до перезагрузки)</div>
                </div>

                <button
                    type="button"
                    onClick={() => dispatch(clearLogs())}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                >
                    Очистить
                </button>
            </div>

            <div className="max-h-[360px] overflow-auto px-6 py-4">
                {logs.length === 0 ? (
                    <div className="text-sm text-gray-500">Пока нет действий</div>
                ) : (
                    <ul className="space-y-3">
                        {logs.map((log) => (
                            <li key={log.id} className="rounded-md bg-gray-50 p-3">
                                <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                                <div className="text-sm text-gray-800">{log.message}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
