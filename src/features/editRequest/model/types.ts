import type {ClientRequest} from "../../../entities/request/model/types.ts";

export type EditRequestModalProps = {
    request: ClientRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
};