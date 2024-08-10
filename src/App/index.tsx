import { useEffect, useState, useCallback } from 'react'
import { Form } from './Form'
import { TableList } from './TableList'
import { websocket, isGetTablesResponse, PROTOCOL, isConnectResponse, WEBSOCKET_MESSAGE_TYPE, isGetTableResponse } from '../state/websocket'
import { Table } from './Table'

function App() {
  const [tables, setTables] = useState<Array<string>>([])
  const [tableEntries, setTableEntries] = useState<Array<Record<string, unknown>>>([])
  const [selectedTable, setSelectedTable] = useState<string>("")

  useEffect(() => {
    const cleanup = websocket.subscribe(message => {
      if (isConnectResponse(message)) {
        websocket.send({
          protocol: PROTOCOL.GET_TABLES,
          payload: null
        })
      }

      if (isGetTablesResponse(message)) {
        setTables(message.payload)
      }

      if (isGetTableResponse(message)) {
        console.error('here')
        setTableEntries(message.payload)
      }

      if (message.type === WEBSOCKET_MESSAGE_TYPE.CLOSE) {
        setTableEntries([])
        setTables([])
      }
    })
    return () => { cleanup() }
  }, [])

  const onBack = useCallback(() => {
    setTableEntries([])
    websocket.send({
      protocol: PROTOCOL.GET_TABLES,
      payload: null
    })
  }, [])

  return (
    <>
      {tableEntries.length !== 0 && tables.length !== 0 && (
        <Table
          onBack={onBack}
          name={selectedTable}
          entries={tableEntries}
        />
      )}
      {tables.length !== 0 && tableEntries.length === 0 && (
        <TableList
          onSelect={setSelectedTable}
          tables={tables} />
      )}
      {tables.length === 0 && tableEntries.length === 0 && <Form />}
    </>
  )
}

export default App
