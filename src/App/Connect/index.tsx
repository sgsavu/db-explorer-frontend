import { useEffect, useState } from "react"
import { localStorage } from "../../state/localStorage"
import { connectionInfo$ } from "../../state/connectionInfo"
import { createGetTablesRequest } from "../../state/network/messages/getTables"
import { network } from "../../state/network/network"
import { Connect as ConnectComponent } from "../../Components/Views/Connect"
import { SQLConnectionInfo } from "../../Components/Views/Connect/ConnectForm/const"
import { RecentSQLConnectionInfo } from "../../Components/Views/Connect/RecentConnections/const"

const onConnect = (connectionInfo: SQLConnectionInfo) => {
    connectionInfo$.next(connectionInfo)
    network.out.send(createGetTablesRequest(connectionInfo))
}

export const Connect: React.FC = () => {
    const [recentConnections, setRecentConnections] = useState<Array<RecentSQLConnectionInfo>>([])

    useEffect(() => {
        const cleanup = localStorage.isOpen(isOpen => {
            if (isOpen) {
                localStorage.dbGetAll()
                    .then(setRecentConnections)
                    .catch(console.error)
            }
        })
        return () => { cleanup() }
    }, [])

    return (
        <ConnectComponent
            onConnect={onConnect}
            recentConnections={recentConnections}
        />
    )
}