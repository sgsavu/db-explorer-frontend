import { connectionInfo$ } from "../../state/connectionInfo"
import { selectedTable$ } from "../../state/selectedTable"
import { io } from "../../state/network/network"
import { createDeleteRecordRequest } from "../../state/network/messages/deleteRecord"
import { createInsertRecordRequest } from "../../state/network/messages/insertRecord"
import { createEditRecordRequest } from "../../state/network/messages/editRecord"
import { primaryKeys$ } from "../../state/primaryKeys"
import { createRenameTableRequest } from "../../state/network/messages/renameTable"
import { createDuplicateRecordRequest } from "../../state/network/messages/duplicateRecord"

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

    io.out.send(createInsertRecordRequest(
        connectInfo,
        selectedTable.toLowerCase(),
        record
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

    io.out.send(createEditRecordRequest(
        connectInfo,
        selectedTable,
        columnName,
        columnValue,
        row
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

    io.out.send(createDuplicateRecordRequest(
        connectInfo,
        selectedTable.toLowerCase(),
        record
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

    io.out.send(createDeleteRecordRequest(
        connectInfo,
        selectedTable.toLowerCase(),
        record
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

    io.out.send(createRenameTableRequest(
        connectInfo,
        selectedTable,
        formattedNewName
    ))
}