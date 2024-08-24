import { SQLConnectionInfo } from "@sgsavu/db-explorer-components";
import { createSubject } from "@sgsavu/subject";

export const connectionInfo$ = createSubject<SQLConnectionInfo | null>({
    initValue: null,
    replay: 1
})