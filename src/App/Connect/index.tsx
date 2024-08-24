import { useEffect, useState } from "react"
import { localStorage } from "../../state/localStorage"
import { connectionInfo$ } from "../../state/connectionInfo"
import { createGetTablesRequest } from "../../state/network/messages/getTables"
import { io } from "../../state/network/network"
import { Connect as ConnectComponent, RecentSQLConnectionInfo, SQLConnectionInfo } from "@sgsavu/db-explorer-components"

const onConnect = (connectionInfo: SQLConnectionInfo) => {
    connectionInfo$.next(connectionInfo)
    io.out.send(createGetTablesRequest(connectionInfo))
}

export const Connect: React.FC = () => {
    const [recentConnections, setRecentConnections] = useState<Array<RecentSQLConnectionInfo>>([])

    useEffect(() => {
        const cleanup = localStorage.isOpen(isOpen => {
            if (isOpen) {
                localStorage.getAll()
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