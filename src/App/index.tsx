import { useEffect, useState, useCallback } from 'react'
import { Connect } from './Connect'
import { TableList } from './TableList'
import { Table } from './Table'
import { connect$ } from '../state/connect'
import { selectedTable$ } from '../state/selectedTable'
import { localStorage } from '../state/localStorage'
import { sha256 } from '../state/crypto'
import { network } from '../state/network/network'
import { createGetTablesRequest, isGetTablesResponse } from '../state/network/messages/getTables'
import { isGetTableResponse } from '../state/network/messages/getTable'
import { isDeleteRecordResponse } from '../state/network/messages/deleteRecord'
import { isInsertRecordResponse } from '../state/network/messages/insertRecord'
import { SORT_MODE } from './Table/consts'
import { isEditRecordResponse } from '../state/network/messages/editRecord'
import { isDuplicateTableResponse } from '../state/network/messages/duplicateTable'
import { isDeleteTableResponse } from '../state/network/messages/deleteTable'
import { isRenameTableResponse } from '../state/network/messages/renameTable'

const storeConnect = () => {
  const connectInfo = connect$.getLatestValue()
  if (!connectInfo) {
    console.warn("App - storeConnect: connectInfo not valid.", { connectInfo })
    return
  }

  const serialised = JSON.stringify(connectInfo)

  try {
    sha256(serialised).then(hash => { localStorage.set({ ...connectInfo, id: hash }) })
  } catch (error) {
    console.error("App - storeConnect: saving connectInfo to storage failed.", { serialised, connectInfo })
  }
}

const sortTableEntries = (
  tableEntries: Array<Record<string, string>>,
  sortKey: string,
  sortMode: SORT_MODE
) => {
  // TODO: remove when eslint updates
  const typedEntries = tableEntries as typeof tableEntries & { toSorted: (fn: (a: typeof tableEntries[0], b: typeof tableEntries[0]) => number) => typeof tableEntries }

  const sorted = typedEntries.toSorted((a, b) => {
    const numberA = Number(a[sortKey])
    const numberB = Number(b[sortKey])

    if (isFinite(numberA) && isFinite(numberB)) {
      return numberA - numberB
    }

    if (a[sortKey] < b[sortKey]) {
      return -1
    }
    if (a[sortKey] > b[sortKey]) {
      return 1
    }
    return 0
  })

  const typedSorted = sorted as typeof sorted & { toReversed: () => typeof typedEntries } // TODO: remove when eslint updates

  return sortMode === SORT_MODE.DESCENDING ? typedSorted.toReversed() : sorted
}

function App() {
  const [tables, setTables] = useState<Array<string>>([])
  const [tableEntries, setTableEntries] = useState<Array<Record<string, string>>>([])

  useEffect(() => {
    const sub = network.in.listen(response => {
      if (
        isGetTablesResponse(response) ||
        isDuplicateTableResponse(response) ||
        isDeleteTableResponse(response) ||
        isRenameTableResponse(response)
      ) {
        setTables(response.body.result)
        storeConnect() // TODO: move this elsewhere
      }
      else if (
        isGetTableResponse(response) ||
        isDeleteRecordResponse(response) ||
        isInsertRecordResponse(response) || 
        isEditRecordResponse(response)
      ) { setTableEntries(response.body.result) }
    })

    return () => { sub.unsubscribe() }
  }, [])

  const onTableBack = useCallback(() => {
    setTableEntries([])
    selectedTable$.next(null)

    const connectInfo = connect$.getLatestValue()
    if (!connectInfo) {
      console.warn("App - onTableBack: connectInfo not valid.", { connectInfo })
      return
    }

    network.out.send(createGetTablesRequest(connectInfo))
  }, [])

  const onTableListBack = useCallback(() => {
    setTables([])
    connect$.next(null)
  }, [])

  const onSort = useCallback((key: string, sortMode: SORT_MODE) => {
    setTableEntries(prev => sortTableEntries(prev, key, sortMode))
  }, [])

  return (
    <>
      {tableEntries.length !== 0 && tables.length !== 0 && (
        <Table
          onBack={onTableBack}
          onSort={onSort}
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
