import { SQLConnectionInfo } from "@sgsavu/db-explorer-components";

export const convertConnectionInfoToHeaders = (connectionInfo: SQLConnectionInfo) => ({
    "X-DB-Type": connectionInfo.type,
    "X-DB-Host": connectionInfo.host,
    "X-DB-Port": connectionInfo.port,
    "X-DB-User": connectionInfo.user,
    "X-DB-Pass": connectionInfo.password,
    "X-DB-Name": connectionInfo.dbName
})