import { DBConnect } from "../App/Connect"

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

export enum MESSAGE_ALIAS {
    INSERT_RECORD = "INSERT_RECORD",
    DELETE_RECORD = "DELETE_RECORD",
    GET_TABLES = "GET_TABLES",
    GET_TABLE = "GET_TABLE"
}

export type GetTablesResponseBody = {
    result: Array<string>
}

export const isGetTablesResponse = (response: Response): response is Response<GetTablesResponseBody> => response.alias === MESSAGE_ALIAS.GET_TABLES

export type GetTableResponseBody = {
    result: Array<Record<string, unknown>>
}

export const isGetTableResponse = (response: Response): response is Response<GetTableResponseBody> => response.alias === MESSAGE_ALIAS.GET_TABLE

export const createGetTablesRequest = (connect: DBConnect): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_TABLES,
        config: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/"
    }
}

export const createGetTableRequest = (connect: DBConnect, tableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_TABLE,
        config: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/"
    }
}

export const isDeleteRecordResponse = (response: Response): response is Response<GetTableResponseBody> => response.alias === MESSAGE_ALIAS.DELETE_RECORD

export const createDeleteRecordRequest = (connect: DBConnect, tableName: string, recordId: string): Request => {
    return {
        alias: MESSAGE_ALIAS.DELETE_RECORD,
        config: {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/" + recordId + "/"
    }
}

export const isInsertRecordResponse = (response: Response): response is Response<GetTableResponseBody> => response.alias === MESSAGE_ALIAS.INSERT_RECORD

export const createInsertRecordRequest = (connect: DBConnect, tableName: string, record: Array<string>): Request => {
    return {
        alias: MESSAGE_ALIAS.INSERT_RECORD,
        config: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connect, record }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/"
    }
}

type InSubFn = (response: Response) => void
type OutSubFn = (request: Request) => void

export const createNetwork = () => {
    let outSubs: Record<number, OutSubFn> = {}
    let outSubIndex = 0

    let inSubs: Record<number, InSubFn> = {}
    let inSubIndex = 0

    const notifySubs = <X, T extends (message: X) => void>(subs: Record<number, T>, message: X) => {
        Object.values(subs).forEach(subscriber => {
            subscriber(message)
        })
    }

    return {
        out: ({
            send: (request: Request) => {
                notifySubs(outSubs, request)

                try {
                    fetch(request.url, request.config)
                        .then(response =>
                            response.json()
                                .then(body => {
                                    notifySubs(
                                        inSubs,
                                        {
                                            alias: request.alias,
                                            body,
                                            statusCode: response.status,
                                            url: request.url,
                                        }
                                    )
                                })
                        )
                } catch (error) {
                    console.error('Error when fetching:', error)
                }
            },
            listen: (fn: OutSubFn) => {
                const idx = outSubIndex
                outSubIndex += 1
                outSubs[`${idx}`] = fn

                return {
                    unsubscribe: () => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [idx]: _, ...rest } = outSubs
                        outSubs = rest
                    }
                }
            }
        }),
        in: ({
            listen: (fn: InSubFn) => {
                const idx = inSubIndex
                inSubIndex += 1
                inSubs[`${idx}`] = fn

                return {
                    unsubscribe: () => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [idx]: _, ...rest } = inSubs
                        inSubs = rest
                    }
                }
            }
        })
    }
}

export const network = createNetwork()