import { connect$ } from '../../state/connect'
import { selectedTable$ } from '../../state/selectedTable'
import { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { useObservable } from '../../hooks'
import { network } from '../../state/network/network'
import { createDeleteRecordRequest, isDeleteRecordRejection, isDeleteRecordRequest } from '../../state/network/messages/deleteRecord'
import { createGetTableRequest, isGetTableRequest } from '../../state/network/messages/getTable'
import { createInsertRecordRequest, isInsertRecordRejection, isInsertRecordRequest } from '../../state/network/messages/insertRecord'
import './index.css'
import { DEFAULT_SORT_MODE, SORT_MODE } from './consts'
import { Input } from '../../Components/Input'
import { isGetTableRejection } from '../../state/network/messages/getTable'

const onAdd: FormEventHandler<HTMLFormElement> = e => {
  e.preventDefault()

  const formData = new FormData(e.target as HTMLFormElement)
  const record = Array.from(formData.entries()).map(el => el[1]) as Array<string>

  const connectInfo = connect$.getLatestValue()
  if (!connectInfo) {
    console.warn("Table - onRefresh: connectInfo not valid.", { connectInfo })
    return
  }

  const selectedTable = selectedTable$.getLatestValue()
  if (!selectedTable) {
    console.warn("Table - onRefresh: selectedTable not valid.", { selectedTable })
    return
  }

  network.out.send(createInsertRecordRequest(
    connectInfo,
    selectedTable.toLowerCase(),
    record
  ))
}

const onDelete = (id: string) => {
  const connectInfo = connect$.getLatestValue()
  if (!connectInfo) {
    console.warn("Table - onRefresh: connectInfo not valid.", { connectInfo })
    return
  }

  const selectedTable = selectedTable$.getLatestValue()
  if (!selectedTable) {
    console.warn("Table - onRefresh: selectedTable not valid.", { selectedTable })
    return
  }

  network.out.send(createDeleteRecordRequest(
    connectInfo,
    selectedTable.toLowerCase(),
    id
  ))
}

const onRefresh = () => {
  const connectInfo = connect$.getLatestValue()
  if (!connectInfo) {
    console.warn("Table - onRefresh: connectInfo not valid.", { connectInfo })
    return
  }

  const selectedTable = selectedTable$.getLatestValue()
  if (!selectedTable) {
    console.warn("Table - onRefresh: selectedTable not valid.", { selectedTable })
    return
  }

  network.out.send(createGetTableRequest(
    connectInfo,
    selectedTable.toLowerCase()
  ))
}

type Props = {
  entries: Array<Record<string, string>>
  onBack?: () => void
  onSort?: (key: string, sortMode: SORT_MODE) => void
}

type Coord = {
  row: number
  column: number
}

export const Table: React.FC<Props> = ({
  entries,
  onBack,
  onSort
}) => {
  const [editable, setEditable] = useState<Coord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>()
  const [sortMode, setSortMode] = useState<SORT_MODE>()
  const tableName = useObservable(selectedTable$)

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

  const columns = Object.keys(entries[0])

  useEffect(() => {
    const inSub = network.in.listen(resp => {
      if (
        isGetTableRejection(resp) ||
        isInsertRecordRejection(resp) ||
        isDeleteRecordRejection(resp)
      ) { setError(resp.body.error) }
    })

    const outSub = network.out.listen(request => {
      if (
        isGetTableRequest(request) ||
        isInsertRecordRequest(request) ||
        isDeleteRecordRequest(request)
      ) { setError(null) }
    })

    return () => {
      inSub.unsubscribe()
      outSub.unsubscribe()
    }
  }, [])

  return (
    <form onSubmit={onAdd}>
      <div className='buttonsContainer'>
        <button type='button' onClick={onBack}>Back ↩️</button>
        <button type='button' onClick={onRefresh}>Refresh 🔄</button>
      </div>
      <h1>
        {tableName}
      </h1>
      <table>
        <thead>
          <tr>
            {columns.map(column =>
              <th onClick={() => onLocalSort(column)} key={column}>
                <div className='tableHeaderContent'>
                  <div>
                    {column}
                  </div>
                  {sortMode && sortColumn === column &&
                    (<div>
                      {sortMode === SORT_MODE.ASCENDING ? "⬆️" : "⬇️"}
                    </div>)
                  }
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((row, rowIndex) =>
            <tr key={row.ID + rowIndex}>
              {Object.values(row).map((cell, columnIndex) =>
              <td
              key={cell + columnIndex}
            >
              {editable?.row === rowIndex &&
                editable?.column === columnIndex
                ? (
                  <Input
                    clickOnRender
                    defaultValue={cell}
                    onBlur={() => setEditable(null)}
                    required
                    type="text"
                  />
                )
                : (
                  <div
                    className='tableCellValue'
                    onClick={() => setEditable({ row: rowIndex, column: columnIndex })}
                  >
                    {cell}
                  </div>
                )
              }
            </td>
              )}
              <td>
                <button type='button' onClick={() => onDelete(row.ID)}>
                  ❌
                </button>
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
      <div>
        {error}
      </div>
    </form>
  )
}
