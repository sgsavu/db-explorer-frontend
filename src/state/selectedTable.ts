import { createSubject } from "@sgsavu/subject";

export const selectedTable$ = createSubject<string | null>({
    initValue: null,
    replay: 1
})