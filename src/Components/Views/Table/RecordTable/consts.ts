export enum SORT_MODE {
    ASCENDING = "ascending",
    DESCENDING = "descending"
}

export const DEFAULT_SORT_MODE = SORT_MODE.DESCENDING

export enum RECORD_TABLE_ACTION {
    EDIT = "edit",
    DELETE = "delete",
    DUPLICATE = "duplicate",
    INSERT = "insert"
}

export type RecordAction = {
    action: RECORD_TABLE_ACTION
    columnName?: string
    columnValue?: string
    record: Record<string, string>
}