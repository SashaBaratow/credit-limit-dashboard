import type {ClientRequest} from "../../../entities/request/model/types.ts";

export type RequestsTableProps = {
    requests: ClientRequest[];
    onRowClick: (id: string) => void;
};