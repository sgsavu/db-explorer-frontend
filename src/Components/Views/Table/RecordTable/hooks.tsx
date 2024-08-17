import { useCallback, useEffect, useState } from "react"
import { DEFAULT_SORT_MODE, SORT_MODE } from "./consts"

export const sortTableEntries = (
    tableEntries: Array<Record<string, string>>,
    sortKey: string,
    sortMode: SORT_MODE
) => {
    // TODO: remove when eslint updates
    const typedEntries = tableEntries as typeof tableEntries & { toSorted: (fn: (a: typeof tableEntries[0], b: typeof tableEntries[0]) => number) => typeof tableEntries }

    const sorted = typedEntries.toSorted((a, b) => {
        const numberA = Number(a[sortKey])
        const numberB = Number(b[sortKey])

        if (isFinite(numberA) && isFinite(numberB)) {
            return numberA - numberB
        }

        if (a[sortKey] < b[sortKey]) {
            return -1
        }
        if (a[sortKey] > b[sortKey]) {
            return 1
        }
        return 0
    })

    const typedSorted = sorted as typeof sorted & { toReversed: () => typeof typedEntries } // TODO: remove when eslint updates

    return sortMode === SORT_MODE.DESCENDING ? typedSorted.toReversed() : sorted
}

export const useSorting = (
    records: Record<string, string>[]
) => {
    const [sortColumn, setSortColumn] = useState<string>()
    const [sortMode, setSortMode] = useState<SORT_MODE | null>()
    const [sorted, setSorted] = useState<Record<string, string>[]>(records)

    useEffect(() => {
        setSorted(records)
        setSortColumn(undefined) 
    }, [records])

    const onSort = useCallback((column: string) => {
        setSortColumn(column)

        if (!sortMode || sortColumn !== column) {
            setSortMode(DEFAULT_SORT_MODE)
            setSorted(prev => sortTableEntries(prev, column, DEFAULT_SORT_MODE))
            return
        }

        const oppositeSortMode = sortMode === SORT_MODE.DESCENDING
            ? SORT_MODE.ASCENDING
            : SORT_MODE.DESCENDING

        setSorted(prev => sortTableEntries(prev, column, oppositeSortMode))
        setSortMode(oppositeSortMode)
    }, [sortMode, sortColumn])

    return {
        sorted,
        onSort,
        sortColumn,
        sortMode
    }
}