import { SORT_MODE } from "../Components/Views/Table/RecordTable/consts"
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

export const sortTableEntries = (
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