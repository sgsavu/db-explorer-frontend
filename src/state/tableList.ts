import { createSubject } from "./subject";

export const tableList$ = createSubject<Array<string> | null>({
    initValue: null,
    replay: 1
})