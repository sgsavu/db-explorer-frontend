import { connect$ } from "../../state/connect"
import { createGetTableRequest } from "../../state/network/messages/getTable"
import { createGetTablesRequest } from "../../state/network/messages/getTables"
import { network } from "../../state/network/network"
import { selectedTable$ } from "../../state/selectedTable"

const onRefresh = () => {
  const connectInfo = connect$.getLatestValue()
  if (!connectInfo) {
    console.warn("TableList - onClick: connectInfo not valid.", { connectInfo })
    return
  }

  network.out.send(createGetTablesRequest(connectInfo))
}

const onSelect: React.MouseEventHandler<HTMLButtonElement> = e => {
  const selectedTable = e.currentTarget.textContent
  if (!selectedTable) {
    console.warn("TableList - onClick: selectedTable not valid.", { selectedTable })
    return
  }

  selectedTable$.next(selectedTable)

  const connectInfo = connect$.getLatestValue()
  if (!connectInfo) {
    console.warn("TableList - onClick: connectInfo not valid.", { connectInfo })
    return
  }

  network.out.send(createGetTableRequest(connectInfo, selectedTable.toLowerCase()))
}

type Props = {
  onBack?: () => void
  tables: string[]
}

export const TableList: React.FC<Props> = ({
  onBack,
  tables
}) => {
  return (
    <>
      <div className='buttonsContainer'>
        <button onClick={onBack}>Back ↩️</button>
        <button onClick={onRefresh}>Refresh 🔄</button>
      </div>
      <h1>Tables</h1>
      {tables.map(table =>
        <div key={table}>
          <button onClick={onSelect}>
            {table}
          </button>
        </div>
      )}
    </>
  )
}
