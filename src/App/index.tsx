import { useEffect, useState, useCallback } from "react"
import { Button } from "@sgsavu/db-explorer-components"
import { Connect } from "./Connect"
import { TableList } from "./TableList"
import { Table } from "./Table"
import { connectionInfo$ } from "../state/connectionInfo"
import { selectedTable$ } from "../state/selectedTable"
import { io } from "../state/network/network"
import { createGetTablesRequest, isGetTablesResponse } from "../state/network/messages/getTables"
import { isGetTableResponse } from "../state/network/messages/getTable"
import { isDeleteRecordResponse } from "../state/network/messages/deleteRecord"
import { isInsertRecordResponse } from "../state/network/messages/insertRecord"
import { isEditRecordResponse } from "../state/network/messages/editRecord"
import { isDuplicateTableResponse } from "../state/network/messages/duplicateTable"
import { isDeleteTableResponse } from "../state/network/messages/deleteTable"
import { isRenameTableResponse } from "../state/network/messages/renameTable"
import { fetchTable, fetchTableList, storeConnectionInfo } from "./utils"
import { TableRecord } from "../state/network/types"
import { isDuplicateRecordResponse } from "../state/network/messages/duplicateRecord"

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
    const [tableEntries, setTableEntries] = useState<Array<TableRecord>>([])

    useEffect(() => {
        const sub = io.in.listen(response => {
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
                isEditRecordResponse(response) ||
                isDuplicateRecordResponse(response)
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

        io.out.send(createGetTablesRequest(connectInfo))
    }, [])

    return (
        <>
            {tables.length !== 0 && (
                <div>
                    <Button type='button' onClick={onBack} >Back ↩️</Button>
                    <Button type='button' onClick={onRefresh} >Refresh 🔄</Button>
                </div>
            )}
            {tables.length === 0 && <Connect />}
            {tables.length !== 0 && tableEntries.length === 0 && <TableList tables={tables} />}
            {tableEntries.length !== 0 && (
                <Table
                    tableRecords={tableEntries as Array<Record<string, string>>} // TODO: fix types
                />
            )}
        </>
    )
}

export default App
