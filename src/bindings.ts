import { connect$ } from "./state/connect"
import { isDeleteRecordRejection } from "./state/network/messages/deleteRecord"
import { isDeleteTableRejection } from "./state/network/messages/deleteTable"
import { isDuplicateTableRejection } from "./state/network/messages/duplicateTable"
import { isEditRecordRejection } from "./state/network/messages/editRecord"
import { isRenameTableRejection, isRenameTableResponse } from "./state/network/messages/renameTable"
import { createGetPrimaryKeysRequest, isGetPrimaryKeysRejection, isGetPrimaryKeysResponse } from "./state/network/messages/getPrimaryKeys"
import { isGetTableRejection, isGetTableResponse } from "./state/network/messages/getTable"
import { isGetTablesRejection, isGetTablesResponse } from "./state/network/messages/getTables"
import { isInsertRecordRejection } from "./state/network/messages/insertRecord"
import { network } from "./state/network/network"
import { primaryKeys$ } from "./state/primaryKeys"
import { selectedTable$ } from "./state/selectedTable"
import { tableList$ } from "./state/tableList"
import { findArrayDiff } from "./utils"

network.in.listen(resp => {
    if (
        isGetTableRejection(resp) ||
        isInsertRecordRejection(resp) ||
        isDeleteRecordRejection(resp) ||
        isEditRecordRejection(resp) ||
        isGetTablesRejection(resp) ||
        isGetPrimaryKeysRejection(resp) || 
        isDuplicateTableRejection(resp) ||
        isDeleteTableRejection(resp) || 
        isRenameTableRejection(resp)
    ) { window.alert(resp.body.error) }

    if (isGetTableResponse(resp)) {
        const connectInfo = connect$.getLatestValue()
        if (!connectInfo) {
            console.warn("bindings: connectInfo not valid.", { connectInfo })
            return
        }

        const selectedTable = selectedTable$.getLatestValue()
        if (!selectedTable) {
            console.warn("bindings: selectedTable not valid.", { selectedTable })
            return
        }

        network.out.send(createGetPrimaryKeysRequest(connectInfo, selectedTable))
    }

    if (isGetPrimaryKeysResponse(resp)) {
        primaryKeys$.next(resp.body.result)
    }

    if (isRenameTableResponse(resp)) {
        const oldTableList = tableList$.getLatestValue()
        if (!oldTableList) {
            console.warn("bindings: oldTableList not valid.", { oldTableList })
            return
        }
        const newTableList = resp.body.result

        const diff = findArrayDiff(oldTableList, newTableList)
        const newSelectedTable = diff[1]

        selectedTable$.next(newSelectedTable)
    }

    if (isGetTablesResponse(resp)) {
        tableList$.next(resp.body.result)
    }
})

selectedTable$.subscribe(update => {
    if (update === null) {
        primaryKeys$.next(null)
    }
})