import { connectionInfo$ } from "../../state/connectionInfo"
import { selectedTable$ } from "../../state/selectedTable"
import { network } from "../../state/network/network"
import { createDeleteRecordRequest } from "../../state/network/messages/deleteRecord"
import { createInsertRecordRequest } from "../../state/network/messages/insertRecord"
import { createEditRecordRequest } from "../../state/network/messages/editRecord"
import { generateShortId } from "../../utils"
import { primaryKeys$ } from "../../state/primaryKeys"
import { createRenameTableRequest } from "../../state/network/messages/renameTable"

export const insertRecord = (record: Record<string, string>) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("insertRecord: connectInfo not valid.", { connectInfo })
        return
    }

    const selectedTable = selectedTable$.getLatestValue()
    if (!selectedTable) {
        console.warn("insertRecord: selectedTable not valid.", { selectedTable })
        return
    }

    const recordValues = Object.values(record)

    network.out.send(createInsertRecordRequest(
        connectInfo,
        selectedTable.toLowerCase(),
        recordValues
    ))
}

export const duplicateRecord = (record: Record<string, string>) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("duplicateRecord: connectInfo not valid.", { connectInfo })
        return
    }

    const selectedTable = selectedTable$.getLatestValue()
    if (!selectedTable) {
        console.warn("duplicateRecord: selectedTable not valid.", { selectedTable })
        return
    }

    const primaryKeys = primaryKeys$.getLatestValue()
    if (!primaryKeys) {
        console.warn("duplicateRecord: primaryKeys not valid.", { selectedTable })
        return
    }

    const copyRow = { ...record }
    primaryKeys.forEach(primaryKey => {
        copyRow[primaryKey] = generateShortId()
    })
    const recordValues = Object.values(copyRow)

    network.out.send(createInsertRecordRequest(
        connectInfo,
        selectedTable.toLowerCase(),
        recordValues
    ))
}

export const deleteRecord = (record: Record<string, string>) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("deleteRecord: connectInfo not valid.", { connectInfo })
        return
    }

    const selectedTable = selectedTable$.getLatestValue()
    if (!selectedTable) {
        console.warn("deleteRecord: selectedTable not valid.", { selectedTable })
        return
    }

    const recordValues = Object.values(record)

    network.out.send(createDeleteRecordRequest(
        connectInfo,
        selectedTable.toLowerCase(),
        recordValues
    ))
}

export const editRecord = (row: Record<string, string>, columnName: string, columnValue: string) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("editRecord: connectInfo not valid.", { connectInfo })
        return
    }

    const selectedTable = selectedTable$.getLatestValue()
    if (!selectedTable) {
        console.warn("editRecord: selectedTable not valid.", { selectedTable })
        return
    }

    const primaryKeys = primaryKeys$.getLatestValue()
    if (!primaryKeys) {
        console.warn("editRecord: primaryKeys not valid.", { primaryKeys })
        return
    }

    const mainPrimaryKey = primaryKeys[0]
    const recordId = row[mainPrimaryKey]

    network.out.send(createEditRecordRequest(
        connectInfo,
        selectedTable,
        columnName,
        columnValue,
        mainPrimaryKey,
        recordId
    ))
}

export const renameTable = (newName: string) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("renameTable: connectInfo not valid.", { connectInfo })
        return
    }

    const selectedTable = selectedTable$.getLatestValue()
    if (!selectedTable) {
        console.warn("renameTable: selectedTable not valid.", { selectedTable })
        return
    }

    const formattedNewName = newName.trim().split(" ").join("-")

    network.out.send(createRenameTableRequest(
        connectInfo,
        selectedTable,
        formattedNewName
    ))
}