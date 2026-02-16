import {useEffect, useMemo, useState} from 'react';
import type {ClientRequest, RiskReason, ApplicationStatus} from '../../../entities/request/model/types';
import {Modal} from '../../../shared/ui/Modal';
import {Input} from '../../../shared/ui/Input';
import {Select} from '../../../shared/ui/Select';
import {parseNumber} from '../../../shared/lib/parseNumber';
import type {EditFormState, EditRequestModalProps} from "../model/types.ts";

const MIN_LIMIT = 0;
const MAX_LIMIT = 10_000_000;
const RISK_THRESHOLD = 1_000_000;

const baseReasons: Array<{ value: RiskReason; label: string }> = [
    {value: 'Недостаточно документов', label: 'Недостаточно документов'},
    {value: 'Низкий рейтинг', label: 'Низкий рейтинг'},
    {value: 'Просрочки в прошлом', label: 'Просрочки в прошлом'},
    {value: 'Несоответствие данных', label: 'Несоответствие данных'},
];

export function EditRequestModal({request, isOpen, onClose, onSave}: EditRequestModalProps) {

    const [form, setForm] = useState<EditFormState>({
        status: 'New',
        approvedLimit: '',
        reason: '',
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!request) return;

        setForm({
            status: request.status,
            approvedLimit: request.approvedLimit !== undefined ? String(request.approvedLimit) : '',
            reason: request.reason ?? '',
        });

        setError(null);
    }, [request]);

    const approvedLimitNumber = useMemo(() => parseNumber(form.approvedLimit), [form.approvedLimit]);

    const reasonsOptions = useMemo(() => {
        const options = [...baseReasons];

        if (approvedLimitNumber !== null && approvedLimitNumber > RISK_THRESHOLD) {
            options.push({value: 'Особый риск', label: 'Особый риск'});
        }

        return options;
    }, [approvedLimitNumber]);

    const isReasonRequired = approvedLimitNumber !== null && approvedLimitNumber > RISK_THRESHOLD;

    function validate(): boolean {
        setError(null);

        // статус всегда есть
        if (!form.status) {
            setError('Укажите статус');
            return false;
        }

        // approvedLimit может быть пустым (например, для New), но если заполнен — валидируем
        if (form.approvedLimit.trim()) {
            if (approvedLimitNumber === null) {
                setError('Лимит должен быть числом');
                return false;
            }

            if (approvedLimitNumber < MIN_LIMIT || approvedLimitNumber > MAX_LIMIT) {
                setError(`Лимит должен быть от ${MIN_LIMIT} до ${MAX_LIMIT}`);
                return false;
            }
        }

        if (isReasonRequired && !form.reason) {
            setError('При лимите больше 1 000 000 необходимо указать причину');
            return false;
        }

        return true;
    }

    function handleSave() {
        if (!request) return;
        if (!validate()) return;

        const payload: { id: string; status: ApplicationStatus; approvedLimit?: number; reason?: RiskReason } = {
            id: request.id,
            status: form.status,
        };

        if (form.approvedLimit.trim() && approvedLimitNumber !== null) {
            payload.approvedLimit = approvedLimitNumber;
        }

        if (form.reason) {
            payload.reason = form.reason;
        }

        onSave(payload);
    }

    return (
        <Modal isOpen={isOpen} title="Редактирование заявки" onClose={onClose}>
            {!request ? (
                <div className="text-sm text-gray-600">Заявка не выбрана</div>
            ) : (
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="text-gray-500">Клиент</div>
                        <div className="font-medium text-gray-900">{request.fullName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-gray-500">Текущий лимит</div>
                            <div className="font-medium text-gray-900">
                                {request.currentLimit.toLocaleString()} {request.currency}
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-500">Запрошенный лимит</div>
                            <div className="font-medium text-gray-900">
                                {request.requestedLimit.toLocaleString()} {request.currency}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-700">Статус</span>
                            <Select<ApplicationStatus>
                                value={form.status}
                                options={[
                                    {value: 'New', label: 'Новая'},
                                    {value: 'Approved', label: 'Одобрена'},
                                    {value: 'Rejected', label: 'Отклонена'},
                                ]}
                                onChange={(value) => setForm((prev) => ({...prev, status: value}))}
                                ariaLabel="Статус заявки"
                            />
                        </div>

                        <Input
                            label="Одобренный лимит"
                            placeholder="Напр. 1500000"
                            value={form.approvedLimit}
                            onChange={(event) => setForm((prev) => ({...prev, approvedLimit: event.target.value}))}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700">
                          Причина {isReasonRequired ? <span className="text-red-600">*</span> : null}
                        </span>

                        <Select<RiskReason | ''>
                            value={form.reason}
                            options={[
                                {value: '', label: 'Не выбрано'},
                                ...reasonsOptions.map((reason) => ({value: reason.value, label: reason.label})),
                            ]}
                            onChange={(value) => setForm((prev) => ({...prev, reason: value}))}
                            ariaLabel="Причина"
                        />

                        {isReasonRequired && (
                            <div className="text-xs text-gray-500">
                                При лимите больше 1 000 000 причина обязательна
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Отмена
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
