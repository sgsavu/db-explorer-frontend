import { connectionInfo$ } from "../state/connectionInfo"
import { sha256 } from "../state/crypto"
import { localStorage } from "../state/localStorage"
import { createGetTableRequest } from "../state/network/messages/getTable"
import { createGetTablesRequest } from "../state/network/messages/getTables"
import { network } from "../state/network/network"
import { handleError } from "../utils"

export const fetchTableList = () => {
    const connectInfo = connectionInfo$.getLatestValue()
    if (!connectInfo) {
        console.warn("fetchTableList: connectInfo not valid.", { connectInfo })
        return
    }

    network.out.send(createGetTablesRequest(connectInfo))
}

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

export const storeConnectionInfo = () => {
    const connectionInfo = connectionInfo$.getLatestValue()
    if (!connectionInfo) {
        console.warn("storeConnect: connectInfo not valid.", { connectionInfo })
        return
    }

    const serialised = JSON.stringify(connectionInfo)

    sha256(serialised)
        .then(hash => {
            localStorage
                .set({ ...connectionInfo, id: hash })
                .catch(handleError)
        })
        .catch(handleError)
}