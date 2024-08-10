import { PROTOCOL, websocket } from '../../state/websocket'
import './index.css'
import { useCallback } from 'react'

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
      protocol: PROTOCOL.DELETE_RECORD,
      payload: {
        table: name.toLowerCase(),
        id
      }
    })
  }, [name])

  return (
    <>
      <button className='backButton' onClick={onBack}>Back</button>
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
                <td>{cell as string}</td>
              )}
              <td>
                <button onClick={() => onDelete(row.ID as string)}>
                  🗑️
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
