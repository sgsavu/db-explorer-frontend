import { useMemo, useCallback, useState, useRef, FormEvent } from "react"
import { DEFAULT_SORT_MODE, SORT_MODE } from "./consts"
import { insertRecord, refreshTable } from "./utils"
import { Title } from "./Title"
import { Row } from "./Row"
import styles from "./index.module.css"

const submitForm = (formElement: HTMLFormElement) => {
    const formData = new FormData(formElement)
    const record = Array.from(formData.entries()).map(el => el[1]) as Array<string>

    insertRecord(record)
}

type Props = {
  entries: Array<Record<string, string>>
  onBack?: () => void
  onSort?: (key: string, sortMode: SORT_MODE) => void
}

export const Table: React.FC<Props> = ({
    entries: records,
    onBack,
    onSort
}) => {
    const [sortColumn, setSortColumn] = useState<string>()
    const [sortMode, setSortMode] = useState<SORT_MODE>()
    const [showSearch, setShowSearch] = useState(false)
    const [filters, setFilters] = useState<Record<string, string>>({})

    const formRef = useRef<HTMLFormElement>(null)

    const columns = Object.keys(records[0])

    const onSubmit = () => {
        const formElement = formRef.current
        if (!formElement) {
            return
        }

        const isFormValid = formElement.reportValidity()
        if (!isFormValid) {
            return
        }
      
        submitForm(formElement)
    }

    const onFilterInput = (e: FormEvent, column: string) => {
        const target = e.target as unknown as { value: string }
        setFilters(prev => ({ ...prev, [column]: target.value }))
    }

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

    const filtered = useMemo(() =>
        records.filter(record =>
            Object.values(record).every((value, columnIndex) => {
                const columnName = columns[columnIndex]
                const filter = filters[columnName]
                if (!filter) { return true }

                const dynamicRegex = new RegExp(filter, "i");

                return value.match(dynamicRegex)
            })
        )
    , [records, filters, columns])

    return (
        <form ref={formRef}>
            <div>
                <button type='button' onClick={onBack}>Back ↩️</button>
                <button type='button' onClick={refreshTable}>Refresh 🔄</button>
            </div>

            <Title/>

            <table>
                <thead>
                    <tr>
                        {columns.map(column =>
                            <th onClick={() => onLocalSort(column)} key={column}>
                                <div>
                                    {column}
                                    {sortMode && sortColumn === column && (
                                        <div>
                                            {sortMode === SORT_MODE.ASCENDING ? "⬆️" : "⬇️"}
                                        </div>
                                    )}
                                </div>
                            </th>
                        )}
                        <th onClick={() => {setShowSearch(prev =>!prev)}}>
                          🔎
                        </th>
                    </tr>
                </thead>
                {showSearch && (
                    <tr>
                        {columns.map(column =>
                            <td>
                                <input
                                    id={column}
                                    name={column}
                                    onInput={e => onFilterInput(e, column)}
                                    value={filters[column] ?? ""}
                                />
                            </td>
                        )}
                        <td className={styles.hoverableCell} onClick={() => setFilters({})}>
                          Reset
                        </td>
                    </tr>
                )}
                <tbody>
                    {filtered.map((row, index) =>
                        <Row row={row} index={index}/>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        {columns.map(column =>
                            <td>
                                <input id={column} name={column} required />
                            </td>
                        )}
                        <td className={styles.hoverableCell} onClick={onSubmit}>
                            +
                        </td>
                    </tr>
                </tfoot>
            </table>
        </form>
    )
}
