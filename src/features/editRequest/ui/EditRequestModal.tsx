import {useMemo, useState} from 'react';
import type {RiskReason, ApplicationStatus} from '../../../entities/request/model/types';
import {Input} from '../../../shared/ui/Input';
import {parseNumber} from '../../../shared/lib/parseNumber';
import type {EditFormState, EditRequestModalProps} from "../model/types.ts";
import {Select} from "../../../shared/ui/select";
import {Modal} from "../../../shared/ui/modal";
import {maskAccount} from "../../../shared/lib/maskAccount.ts";
import {Button} from "../../../shared/ui/button";

const MIN_LIMIT = 0;
const MAX_LIMIT = 10_000_000;
const RISK_THRESHOLD = 1_000_000;

const baseReasons: Array<{ value: RiskReason; label: string }> = [
    {value: 'Недостаточно документов', label: 'Недостаточно документов'},
    {value: 'Низкий рейтинг', label: 'Низкий рейтинг'},
    {value: 'Просрочки в прошлом', label: 'Просрочки в прошлом'},
    {value: 'Несоответствие данных', label: 'Несоответствие данных'},
];

export function EditRequestModal({ request, isOpen, isSaving, saveError, onClose, onSave }: EditRequestModalProps) {


    const [form, setForm] = useState<EditFormState>(() => {
        if (!request) {
            return { status: 'New', approvedLimit: '', reason: '' };
        }

        return {
            status: request.status,
            approvedLimit: request.approvedLimit !== undefined ? String(request.approvedLimit) : '',
            reason: request.reason ?? '',
        };
    });

    const [error, setError] = useState<string | null>(null);


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

        if (!form.status) {
            setError('Укажите статус');
            return false;
        }

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

    function handleClose() {
        if (isSaving) return;
        setError(null);
        onClose();
    }


    return (
        <Modal isOpen={isOpen} title="Редактирование заявки" onClose={handleClose}>
            {!request ? (
                <div className="text-sm text-gray-600">Заявка не выбрана</div>
            ) : (
                <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-gray-500">Клиент</div>
                            <div className="font-medium text-gray-900">{request.fullName}</div>
                        </div>
                        <div>
                            <div className="text-gray-500">Счет</div>
                            <div className="font-medium text-gray-900">{maskAccount(request.account)}</div>
                        </div>
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
                            label="Новый лимит"
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

                    {saveError && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {saveError}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Отмена
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            isLoading={isSaving}
                            onClick={handleSave}
                        >
                            Сохранить
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
