import { createIndexedDB } from "@sgsavu/local-storage"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"

const INDEXED_DB = "db-explorer"
const OBJECT_STORE = "logins"

export const localStorage = createIndexedDB<SQLConnectionInfo>(INDEXED_DB, OBJECT_STORE)
