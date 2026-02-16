import type {ApplicationStatus, ClientRequest, RiskReason} from "../../../entities/request/model/types.ts";

export type EditFormState = {
    status: ApplicationStatus;
    approvedLimit: string; // строкой, чтобы удобно вводить
    reason: RiskReason | '';
};

export type EditRequestModalProps = {
    request: ClientRequest | null;
    isOpen: boolean;
    isSaving: boolean;
    saveError: string | null;
    onClose: () => void;
    onSave: (payload: { id: string; status: ApplicationStatus; approvedLimit?: number; reason?: RiskReason }) => void;
};