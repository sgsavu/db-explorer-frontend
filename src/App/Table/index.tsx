import { selectedTable$ } from "../../state/selectedTable"
import { useMemo, useCallback, useState, FormEventHandler } from "react"
import { useObservable } from "../../hooks"
import { DEFAULT_SORT_MODE, SORT_MODE } from "./consts"
import { Input } from "../../Components/Input"
import "./index.css"
import { deleteRecord, duplicateRecord, editRecord, insertRecord, refreshTable, renameTable } from "./utils"

const handleFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const record = Array.from(formData.entries()).map(el => el[1]) as Array<string>

    insertRecord(record)
}

type Coord = {
  row: number
  column: number
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
    const [editable, setEditable] = useState<Coord | null>(null)
    const [sortColumn, setSortColumn] = useState<string>()
    const [sortMode, setSortMode] = useState<SORT_MODE>()
    const [showSearch, setShowSearch] = useState(false)
    const [filters, setFilters] = useState<Record<string, string>>({})
    const tableName = useObservable(selectedTable$) ?? ""

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

    const columns = Object.keys(records[0])

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

    const [editingTableName, setEditingTableName] = useState(false)

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <button type='button' onClick={onBack}>Back ↩️</button>
                <button type='button' onClick={refreshTable}>Refresh 🔄</button>
            </div>
            <h1
                tabIndex={0}
            >
                {editingTableName
                    ? (
                        <Input
                            clickOnRender
                            defaultValue={tableName}
                            onBlur={e => {
                                setEditingTableName(false)

                                const newTableName = e.target.value
                                if (newTableName === tableName) { return }

                                renameTable(newTableName)
                            }}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    e.currentTarget.blur()
                                } else if (e.key === "Escape") {
                                    setEditingTableName(false)
                                }
                            }}
                        />
                    )
                    : <div onClick={() => setEditingTableName(true)} style={{ cursor: "pointer" }}>{tableName}</div>
                }
            </h1>
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
                        <th onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            setShowSearch(!showSearch)
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
                                    onInput={e => {
                                        const target = e.target as unknown as { value: string }
                                        setFilters(prev => ({ ...prev, [column]: target.value }))
                                    }}
                                    name={column}
                                    required
                                    value={filters[column] ?? ""}
                                />
                            </td>
                        )}
                        <td className='hoverableCell' onClick={() => { setFilters({}) }}>
              Reset
                        </td>
                    </tr>
                )}
                <tbody>
                    {filtered.map((row, rowIndex) =>
                        <tr key={row.ID + rowIndex}>
                            {Object.values(row).map((cell, columnIndex) => {
                                const isEditable = editable?.column === columnIndex && editable.row === rowIndex
                                return (
                                    <td
                                        className={isEditable ? "inputCell" : "hoverableCell"}
                                        onFocus={() => {
                                            if (isEditable) { return }
                                            setEditable({ row: rowIndex, column: columnIndex })
                                        }}
                                        tabIndex={0}
                                        key={cell + columnIndex}
                                    >
                                        {editable?.row === rowIndex &&
                      editable?.column === columnIndex
                                            ? (
                                                <Input
                                                    clickOnRender
                                                    defaultValue={cell}
                                                    onBlur={e => {
                                                        setEditable(null)

                                                        const newValue = e.target.value
                                                        if (newValue === cell) { return }

                                                        editRecord(columns[columnIndex], newValue)
                                                    }}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault()
                                                            e.currentTarget.blur()
                                                        } else if (e.key === "Escape") {
                                                            setEditable(null)
                                                        }
                                                    }}
                                                    required
                                                    type="text"
                                                />
                                            )
                                            : (
                                                <div>
                                                    {cell}
                                                </div>
                                            )
                                        }
                                    </td>
                                )
                            }
                            )}
                            <td className='hoverableCell' onClick={() => duplicateRecord(row)}>
                                <div className='duplicateButton'>
                  ⎘
                                </div>
                            </td>
                            <td className='hoverableCell' onClick={() => deleteRecord(row)}>
                ❌
                            </td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        {columns.map(column =>
                            <td><input id={column} name={column} required /></td>
                        )}
                        <td>
                            <button type='submit'>
                +
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </form>
    )
}
