export enum MESSAGE_ALIAS {
    DELETE_TABLE = "DELETE_TABLE",
    DUPLICATE_TABLE = "DUPLICATE_TABLE",
    EDIT_RECORD = "EDIT_RECORD",
    EDIT_TABLE_NAME = "EDIT_TABLE_NAME",
    INSERT_RECORD = "INSERT_RECORD",
    DELETE_RECORD = "DELETE_RECORD",
    GET_PRIMARY_KEYS = "GET_PRIMARY_KEYS",
    GET_TABLES = "GET_TABLES",
    GET_TABLE = "GET_TABLE"
}

export enum STATUS_CODE {
    BAD_REQUEST = 400,
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}

export type Request = {
    alias: MESSAGE_ALIAS
    config: RequestInit
    url: string
}

export type Response<T = Record<string, unknown>> = {
    alias: MESSAGE_ALIAS
    body: T
    statusCode: STATUS_CODE
    url: string
}

export type RejectionBody = {
    error: string
}
