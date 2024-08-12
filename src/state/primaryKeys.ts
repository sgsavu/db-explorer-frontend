import { createSubject } from "./subject";

export const primaryKeys$ = createSubject<Array<string> | null>({
    initValue: null,
    replay: 1
})