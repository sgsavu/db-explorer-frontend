import { ConnectFormProps } from "../ConnectForm"
import { RecentSQLConnectionInfo } from "./const"

export type RecentConnectionsProps = {
    onConnect: ConnectFormProps["onConnect"]
    recentConnections: Array<RecentSQLConnectionInfo>
}

export const RecentConnections: React.FC<RecentConnectionsProps> = ({
    onConnect,
    recentConnections
}) => {

    if (recentConnections.length === 0) { return null }

    const onRecentLogin = (recentConnection: RecentSQLConnectionInfo) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = recentConnection
        onConnect(rest)
    }

    return (
        <>
            <h3>Recent connections</h3>
            {recentConnections.map(login =>
                <button
                    key={login.id}
                    onClick={() => onRecentLogin(login)}
                >
                    <div>
                        {login.id}
                    </div>
                    {login.address} -
                    {login.dbName} -
                    {login.user} -
                    {login.password[0]}
                    {login.password[1]}
                    {"*".repeat(login.password.length - 2)}
                </button>
            )}
        </>
    )
}