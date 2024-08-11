import { DBConnect } from "../App/Connect";
import { createSubject } from "./subject";

export const connect$ = createSubject<DBConnect | null>({
    initValue: null,
    replay: 1
})