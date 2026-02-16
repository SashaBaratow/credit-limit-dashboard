import {Modal} from "../../../shared/ui/modal";
import type {EditRequestModalProps} from "../model/types.ts";

export function EditRequestModal({ request, isOpen, onClose, onSave }: EditRequestModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            title="Редактирование заявки"
            onClose={onClose}
        >
            {!request ? (
                <div className="text-sm text-gray-600">Заявка не выбрана</div>
            ) : (
                <div className="space-y-3 text-sm">
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

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Отмена
                        </button>

                        <button
                            type="button"
                            onClick={onSave}
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
