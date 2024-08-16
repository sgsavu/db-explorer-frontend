import { connectionInfo$ } from "../../state/connectionInfo"
import { createDeleteTableRequest } from "../../state/network/messages/deleteTable"
import { createDuplicateTableRequest } from "../../state/network/messages/duplicateTable"
import { network } from "../../state/network/network"
import { selectedTable$ } from "../../state/selectedTable"
import { generateShortId } from "../../utils"
import { fetchTable } from "../utils"

export const selectTable = (tableName: string) => {
    selectedTable$.next(tableName)
    fetchTable(tableName)
}

export const duplicateTable = (sourceTableName: string) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("duplicateTable: connectInfo not valid.", { connectInfo })
        return
    }

    const sourceTableNameFormatted = sourceTableName.toLowerCase()
    const newTableName = sourceTableName + "-copy-" + generateShortId()

    network.out.send(createDuplicateTableRequest(
        connectInfo,
        sourceTableNameFormatted,
        newTableName
    ))
}

export const deleteTable = (tableName: string) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("deleteTable: connectInfo not valid.", { connectInfo })
        return
    }

    network.out.send(createDeleteTableRequest(
        connectInfo,
        tableName.toLowerCase()
    ))
}