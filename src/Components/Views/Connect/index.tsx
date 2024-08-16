import { ConnectForm, ConnectFormProps } from "./ConnectForm"
import { RecentConnections, RecentConnectionsProps } from "./RecentConnections"

export type ConnectProps = {
    onConnect: ConnectFormProps["onConnect"]
    recentConnections: RecentConnectionsProps["recentConnections"]
}

export const Connect: React.FC<ConnectProps> = ({
    onConnect,
    recentConnections
}) => {
    return (
        <>
            <h1>MySQL Visualizer</h1>

            <ConnectForm
                onConnect={onConnect}
            />

            <RecentConnections
                onConnect={onConnect}
                recentConnections={recentConnections}
            />
        </>
    )
}