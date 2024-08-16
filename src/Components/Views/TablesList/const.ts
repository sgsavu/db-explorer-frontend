export enum TABLE_LIST_ACTION {
    SELECT = "select",
    DELETE = "delete",
    DUPLICATE = "duplicate"
}

export type TableAction = {
    action: TABLE_LIST_ACTION
    tableName: string
}