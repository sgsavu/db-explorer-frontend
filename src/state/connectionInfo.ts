import { createSubject } from "@sgsavu/subject";
import { SQLConnectionInfo } from "../Components/Views/Connect/ConnectForm/const";

export const connectionInfo$ = createSubject<SQLConnectionInfo | null>({
    initValue: null,
    replay: 1
})