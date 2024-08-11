import { connect$ } from '../../state/connect'
import { createDeleteRecordRequest, createGetTableRequest, createInsertRecordRequest, network } from '../../state/network'
import { selectedTable$ } from '../../state/selectedTable'
import { FormEventHandler, useCallback, useState } from 'react'
import { useObservable } from '../../hooks'
import './index.css'

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
  entries: Array<Record<string, unknown>>
  onBack?: () => void
  onSort?: (value: string, sortAscending: boolean) => void
}

export const Table: React.FC<Props> = ({
  entries,
  onBack,
  onSort
}) => {
  const [sortAscending, setSortAscending] = useState(false)
  const tableName = useObservable(selectedTable$)

  const onLocalSort = useCallback((value: string) => {
    onSort?.(value, !sortAscending)
    setSortAscending(prev => !prev)
  }, [onSort, sortAscending])

  const columns = Object.keys(entries[0])

  return (
    <form onSubmit={onAdd}>
      <div className='buttonsContainer'>
        <button onClick={onBack}>Back ↩️</button>
        <button onClick={onRefresh}>Refresh 🔄</button>
      </div>
      <h1>
        {tableName}
      </h1>
      <table>
        <thead>
          <tr>
            {columns.map(column =>
              <th onClick={() => onLocalSort(column)} key={column}>
                <div>
                  {column}
                </div>
                <div>
                  {sortAscending ? "⬆️" : "⬇️"}
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map(row =>
            <tr key={row.ID as string}>
              {Object.values(row).map(cell =>
                <td key={cell as string}>{cell as string}</td>
              )}
              <td>
                <button type='button' onClick={() => onDelete(row.ID as string)}>
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
    </form>
  )
}
