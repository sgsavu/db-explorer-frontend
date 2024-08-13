import { connectionInfo$ } from "../state/connectionInfo"
import { createGetTableRequest } from "../state/network/messages/getTable"
import { network } from "../state/network/network"

export const fetchTable = (tableName: string) => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("fetchTable: connectInfo not valid.", { connectInfo })
        return
    }

    network.out.send(createGetTableRequest(
        connectInfo, 
        tableName.toLowerCase()
    ))
}