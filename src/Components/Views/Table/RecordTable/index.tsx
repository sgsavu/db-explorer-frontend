import { useMemo, useState, useRef, FormEvent } from "react"
import { RECORD_TABLE_ACTION, RecordAction, SORT_MODE } from "./consts"
import { useSorting } from "./hooks"
import styles from "./index.module.css"
import { Row } from "./Row"

type Props = {
    entries: Array<Record<string, string>>
    onRecordAction: (recordAction: RecordAction) => void
    primaryKeys: Array<string>
}

export const RecordTable: React.FC<Props> = ({
    entries: records,
    onRecordAction,
    primaryKeys
}) => {
    const [showSearch, setShowSearch] = useState(false)
    const [filters, setFilters] = useState<Record<string, string>>({})

    const formRef = useRef<HTMLFormElement>(null)

    const columns = Object.keys(records[0])

    const {
        sorted,
        sortColumn,
        sortMode,
        onSort
    } = useSorting(records)

    const onSubmit = () => {
        const formElement = formRef.current
        if (!formElement) {
            return
        }

        const isFormValid = formElement.reportValidity()
        if (!isFormValid) {
            return
        }

        const formData = new FormData(formElement)
        const record = Object.fromEntries(Array.from(formData.entries())) as Record<string, string>

        onRecordAction({
            action: RECORD_TABLE_ACTION.INSERT,
            record
        })
    }

    const onFilterInput = (e: FormEvent, column: string) => {
        const target = e.target as unknown as { value: string }
        setFilters(prev => ({ ...prev, [column]: target.value }))
    }

    const filtered = useMemo(() =>
        sorted.filter(record =>
            Object.values(record).every((value, columnIndex) => {
                const columnName = columns[columnIndex]
                const filter = filters[columnName]
                if (!filter) { return true }

                const dynamicRegex = new RegExp(filter, "i");

                return value.match(dynamicRegex)
            })
        )
    , [sorted, filters, columns])

    return (
        <>
            <form ref={formRef}>
                <table>
                    <thead>
                        <tr>
                            {columns.map(column =>
                                <th onClick={() => onSort(column)} key={column}>
                                    <div>
                                        {column} {primaryKeys.includes(column) ? "*" : ""}
                                        {sortMode && sortColumn === column && (
                                            <div>
                                                {sortMode === SORT_MODE.ASCENDING ? "⬆️" : "⬇️"}
                                            </div>
                                        )}
                                    </div>
                                </th>
                            )}
                            <th onClick={() => {
                                setShowSearch(prev => !prev)
                                setFilters({})
                            }}>
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
                            <Row
                                onRowAction={onRecordAction}
                                key={index}
                                row={row}
                            />
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            {columns.map((column, index) =>
                                <td key={index}>
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
        </>
    )
}
