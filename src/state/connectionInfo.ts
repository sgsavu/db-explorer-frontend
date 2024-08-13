import { DBConnect } from "../App/Connect";
import { createSubject } from "./subject";

export const connectionInfo$ = createSubject<DBConnect | null>({
    initValue: null,
    replay: 1
})