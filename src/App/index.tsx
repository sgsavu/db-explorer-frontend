import { useEffect, useState, useCallback } from "react"
import { Connect } from "./Connect"
import { TableList } from "./TableList"
import { Table } from "./Table"
import { connectionInfo$ } from "../state/connectionInfo"
import { selectedTable$ } from "../state/selectedTable"
import { network } from "../state/network/network"
import { createGetTablesRequest, isGetTablesResponse } from "../state/network/messages/getTables"
import { isGetTableResponse } from "../state/network/messages/getTable"
import { isDeleteRecordResponse } from "../state/network/messages/deleteRecord"
import { isInsertRecordResponse } from "../state/network/messages/insertRecord"
import { isEditRecordResponse } from "../state/network/messages/editRecord"
import { isDuplicateTableResponse } from "../state/network/messages/duplicateTable"
import { isDeleteTableResponse } from "../state/network/messages/deleteTable"
import { isRenameTableResponse } from "../state/network/messages/renameTable"
import { fetchTable, fetchTableList, sortTableEntries, storeConnectionInfo } from "./utils"
import { SORT_MODE } from "../Components/Views/Table/RecordTable/consts"

const onRefresh = () => {
    const selectedTable = selectedTable$.getLatestValue()
    if (!selectedTable) {
        fetchTableList()
        return
    }
    fetchTable(selectedTable)
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
                storeConnectionInfo() // TODO: move this elsewhere
            } else if (
                isGetTableResponse(response) ||
                isDeleteRecordResponse(response) ||
                isInsertRecordResponse(response) ||
                isEditRecordResponse(response)
            ) {
                setTableEntries(response.body.result)
            }
        })

        return () => {
            sub.unsubscribe()
        }
    }, [])

    const onBack = useCallback(() => {
        const selectedTable = selectedTable$.getLatestValue()
        if (!selectedTable) {
            setTables([])
            connectionInfo$.next(null)
            return
        }

        setTableEntries([])
        selectedTable$.next(null)

        const connectInfo = connectionInfo$.getLatestValue()
        if (!connectInfo) {
            console.warn("App - onTableBack: connectInfo not valid.", { connectInfo })
            return
        }

        network.out.send(createGetTablesRequest(connectInfo))
    }, [])

    const onSort = useCallback((key: string, sortMode: SORT_MODE) => {
        setTableEntries(prev => sortTableEntries(prev, key, sortMode))
    }, [])

    return (
        <>
            {tables.length !== 0 && (
                <div>
                    <button type='button' onClick={onBack} >Back ↩️</button>
                    <button type='button' onClick={onRefresh} >Refresh 🔄</button>
                </div>
            )}
            {tables.length === 0 && <Connect />}
            {tables.length !== 0 && tableEntries.length === 0 && <TableList tables={tables} />}
            {tableEntries.length !== 0 && (
                <Table
                    onTableSort={onSort}
                    tableRecords={tableEntries}
                />
            )}
        </>
    )
}

export default App
