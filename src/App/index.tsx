import { useEffect, useState, useCallback } from 'react'
import { Connect } from './Connect'
import { TableList } from './TableList'
import { Table } from './Table'
import { network, isGetTablesResponse, isGetTableResponse, createGetTablesRequest, isDeleteRecordResponse, isInsertRecordResponse } from '../state/network'
import { connect$ } from '../state/connect'
import { selectedTable$ } from '../state/selectedTable'

function App() {
  const [tables, setTables] = useState<Array<string>>([])
  const [tableEntries, setTableEntries] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    const sub = network.in.listen(response => {
      if (isGetTablesResponse(response)) { setTables(response.body.result) }
      else if (
        isGetTableResponse(response) ||
        isDeleteRecordResponse(response) ||
        isInsertRecordResponse(response)
      ) { setTableEntries(response.body.result) }
    })

    return () => { sub.unsubscribe() }
  }, [])

  const onTableBack = useCallback(() => {
    setTableEntries([])
    selectedTable$.next(null)

    const connectInfo = connect$.getLatestValue()
    if (!connectInfo) {
      console.warn("Table - onRefresh: connectInfo not valid.", { connectInfo })
      return
    }

    network.out.send(createGetTablesRequest(connectInfo))
  }, [])

  const onTableListBack = useCallback(() => {
    setTables([])
    connect$.next(null)
  }, [])

  // const onSort = useCallback((key: string, sortAscending: boolean) => {
  //   setTableEntries(prev => prev.toSorted((a, b) => sortAscending
  //     ? a[key] - b[key]
  //     : b[key] - a[key]
  //   ))
  // }, [])

  return (
    <>
      {tableEntries.length !== 0 && tables.length !== 0 && (
        <Table
          onBack={onTableBack}
          onSort={() => { }}
          entries={tableEntries}
        />
      )}
      {tables.length !== 0 && tableEntries.length === 0 && (
        <TableList
          onBack={onTableListBack}
          tables={tables} />
      )}
      {tables.length === 0 && tableEntries.length === 0 && <Connect />}
    </>
  )
}

export default App
