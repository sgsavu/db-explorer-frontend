import { WEBSOCKET_MESSAGE_TYPE, websocket } from '../../state/websocket'
import './index.css'
import { FormEventHandler, useCallback } from 'react'

type Props = {
  entries: Array<Record<string, unknown>>
  name: string
  onBack?: () => void
}

export const Table: React.FC<Props> = ({
  entries,
  name,
  onBack
}) => {

  const columns = Object.keys(entries[0])
  const onDelete = useCallback((id: string) => {
    websocket.send({
      type: WEBSOCKET_MESSAGE_TYPE.DELETE_RECORD,
      payload: {
        table: name.toLowerCase(),
        id
      }
    })
  }, [name])

  const onRefresh = () => {
    websocket.send({
      type: WEBSOCKET_MESSAGE_TYPE.GET_TABLE,
      payload: name.toLowerCase()
    })
  }

  const onAdd = useCallback<FormEventHandler<HTMLFormElement>>(e => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const record = Array.from(formData.entries()).map(el => el[1])

    websocket.send({
      type: WEBSOCKET_MESSAGE_TYPE.INSERT_RECORD,
      payload: {
        table: name,
        record 
      }
    })
  }, [name])

  return (
    <form onSubmit={onAdd}>
      <div className='buttonsContainer'>
        <button onClick={onBack}>Back ↩️</button>
        <button onClick={onRefresh}>Refresh 🔄</button>
      </div>
      <h1>
        {name}
      </h1>
      <table>
        <thead>
          <tr>
            {columns.map(column =>
              <th key={column}>{column}</th>
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
              <td><input id={column} name={column} required/></td>
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
