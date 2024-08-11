import { useEffect, useState, useCallback, useRef } from 'react'
import { DBConnect, Connect } from './Connect'
import { TableList } from './TableList'
import { websocket, isGetTablesResponse, isConnectResponse, isGetTableResponse, WEBSOCKET_MESSAGE_TYPE, WEBSOCKET_EVENT } from '../state/websocket'
import { Table } from './Table'
import { db } from '../state/localStorage'
import { sha256 } from '../state/crypto'

function App() {
  const [tables, setTables] = useState<Array<string>>([])
  const [tableEntries, setTableEntries] = useState<Array<Record<string, unknown>>>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const connectInfo = useRef<DBConnect>()

  const onConnect = (data: DBConnect) => {
    connectInfo.current = data
  }

  useEffect(() => {
    const cleanup = websocket.subscribe(message => {
      if (isConnectResponse(message)) {

        const successfulLogin = connectInfo.current

        if (successfulLogin) {
          const serialised = JSON.stringify(successfulLogin)

          sha256(serialised)
            .then(hash => {
              db.set({
                ...successfulLogin,
                id: hash
              })
                .catch(console.error)
            })
            .catch(console.error)
        }

        websocket.send({
          type: WEBSOCKET_MESSAGE_TYPE.GET_TABLES,
          payload: null
        })
      }

      if (isGetTablesResponse(message)) {
        setTables(message.payload)
      }

      if (isGetTableResponse(message)) {
        setTableEntries(message.payload)
      }

      if (message.event === WEBSOCKET_EVENT.CLOSE) {
        setTableEntries([])
        setTables([])
      }
    })
    return () => { cleanup() }
  }, [])

  const onTableBack = useCallback(() => {
    setTableEntries([])
    websocket.send({
      type: WEBSOCKET_MESSAGE_TYPE.GET_TABLES,
      payload: null
    })
  }, [])

  const onTableListBack = useCallback(() => {
    setTables([])
    websocket.close()
  }, [])

  return (
    <>
      {tableEntries.length !== 0 && tables.length !== 0 && (
        <Table
          onBack={onTableBack}
          name={selectedTable}
          entries={tableEntries}
        />
      )}
      {tables.length !== 0 && tableEntries.length === 0 && (
        <TableList
          onBack={onTableListBack}
          onSelect={setSelectedTable}
          tables={tables} />
      )}
      {tables.length === 0 && tableEntries.length === 0 && <Connect onConnect={onConnect} />}
    </>
  )
}

export default App
