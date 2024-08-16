import { useCallback, useState } from "react"
import { DEFAULT_SORT_MODE, SORT_MODE } from "./consts"

export const useSorting = (
    onSort: (key: string, sortMode: SORT_MODE) => void
) => {
    const [sortColumn, setSortColumn] = useState<string>()
    const [sortMode, setSortMode] = useState<SORT_MODE>()

    const onLocalSort = useCallback((column: string) => {
        setSortColumn(column)

        if (!sortMode || sortColumn !== column) {
            setSortMode(DEFAULT_SORT_MODE)
            onSort?.(column, DEFAULT_SORT_MODE)
            return
        }

        const oppositeSortMode = sortMode === SORT_MODE.DESCENDING
            ? SORT_MODE.ASCENDING
            : SORT_MODE.DESCENDING

        onSort?.(column, oppositeSortMode)
        setSortMode(oppositeSortMode)
    }, [onSort, sortMode, sortColumn])

    return {
        onSort: onLocalSort,
        sortColumn,
        sortMode
    }
}