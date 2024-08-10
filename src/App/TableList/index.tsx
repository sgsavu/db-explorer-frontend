import { PROTOCOL, websocket } from "../../state/websocket"

type Props = {
  onSelect?: (value: string) => void
  tables: string[]
}

export const TableList: React.FC<Props> = ({
  onSelect,
  tables
}) => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const selectedTable = e.currentTarget.textContent
    if (!selectedTable) { return }

    onSelect?.(selectedTable)
    websocket.send({
      protocol: PROTOCOL.GET_TABLE,
      payload: selectedTable.toLowerCase()
    })
  }

  return (
    <>
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
