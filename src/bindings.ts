import { connect$ } from "./state/connect"
import { isDeleteRecordRejection } from "./state/network/messages/deleteRecord"
import { isEditRecordRejection } from "./state/network/messages/editRecord"
import { createGetPrimaryKeysRequest, isGetPrimaryKeysRejection, isGetPrimaryKeysResponse } from "./state/network/messages/getPrimaryKeys"
import { isGetTableRejection, isGetTableResponse } from "./state/network/messages/getTable"
import { isGetTablesRejection } from "./state/network/messages/getTables"
import { isInsertRecordRejection } from "./state/network/messages/insertRecord"
import { network } from "./state/network/network"
import { primaryKeys$ } from "./state/primaryKeys"
import { selectedTable$ } from "./state/selectedTable"

network.in.listen(resp => {
    if (
        isGetTableRejection(resp) ||
        isInsertRecordRejection(resp) ||
        isDeleteRecordRejection(resp) ||
        isEditRecordRejection(resp) ||
        isGetTablesRejection(resp) ||
        isGetPrimaryKeysRejection(resp)
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
})

selectedTable$.subscribe(update => {
    if (update === null) {
        primaryKeys$.next(null)
    }
})