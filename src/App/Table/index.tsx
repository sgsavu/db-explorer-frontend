import { useMemo, useState, useRef, FormEvent } from "react"
import { useObservable } from "../../hooks"
import { primaryKeys$ } from "../../state/primaryKeys"
import { SORT_MODE } from "./consts"
import { insertRecord } from "./utils"
import { Title } from "./Title"
import { Row } from "./Row"
import { useSorting } from "./hooks"
import styles from "./index.module.css"

const submitForm = (formElement: HTMLFormElement) => {
    const formData = new FormData(formElement)
    const record = Array.from(formData.entries()).map(el => el[1]) as Array<string>

    insertRecord(record)
}

type Props = {
    entries: Array<Record<string, string>>
    onSort: (key: string, sortMode: SORT_MODE) => void
}

export const Table: React.FC<Props> = ({
    entries: records,
    onSort
}) => {
    const [showSearch, setShowSearch] = useState(false)
    const [filters, setFilters] = useState<Record<string, string>>({})

    const formRef = useRef<HTMLFormElement>(null)

    const primaryKeys = useObservable(primaryKeys$) ?? []

    const columns = Object.keys(records[0])

    const {
        sortColumn,
        sortMode,
        onSort: onLocalSort
    } = useSorting(onSort)

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
            <Title />

            <table>
                <thead>
                    <tr>
                        {columns.map(column =>
                            <th onClick={() => onLocalSort(column)} key={column}>
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
                    {filtered.map((row, index) => <Row key={index} row={row} />)}
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
    )
}
