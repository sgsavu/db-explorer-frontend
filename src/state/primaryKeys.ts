import { createSubject } from "@sgsavu/subject";

export const primaryKeys$ = createSubject<Array<string> | null>({
    initValue: null,
    replay: 1
})