import { WEBSOCKET_MESSAGE_TYPE, websocket } from "../../state/websocket"

type Props = {
  onBack?: () => void
  onSelect?: (value: string) => void
  tables: string[]
}

export const TableList: React.FC<Props> = ({
  onBack,
  onSelect,
  tables
}) => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const selectedTable = e.currentTarget.textContent
    if (!selectedTable) { return }

    onSelect?.(selectedTable)
    websocket.send({
      type: WEBSOCKET_MESSAGE_TYPE.GET_TABLE,
      payload: selectedTable.toLowerCase()
    })
  }

  const onRefresh = () => {
    websocket.send({
      type: WEBSOCKET_MESSAGE_TYPE.GET_TABLES,
      payload: null
    })
  }

  return (
    <>
      <div className='buttonsContainer'>
        <button onClick={onBack}>Back ↩️</button>
        <button onClick={onRefresh}>Refresh 🔄</button>
      </div>
      <h1>Tables</h1>
      {tables.map(table =>
        <div key={table}>
          <button onClick={onClick}>
            {table}
          </button>
        </div>
      )}
    </>
  )
}
