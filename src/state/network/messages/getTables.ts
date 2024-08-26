import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"
import { MESSAGE_ALIAS } from "../consts"
import { RejectionBody } from "../types"
import { convertConnectionInfoToHeaders } from "../utils"

export type GetTablesResponseBody = {
    result: Array<string>
}

export const isGetTablesRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.GET_TABLES

export const isGetTablesResponse = (response: Response): response is Response<GetTablesResponseBody> =>
    response.alias === MESSAGE_ALIAS.GET_TABLES &&
    response.statusCode === STATUS_CODE.OK

export const isGetTablesRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.GET_TABLES &&
    response.statusCode !== STATUS_CODE.OK

export const createGetTablesRequest = (connectionInfo: SQLConnectionInfo): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_TABLES,
        config: {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...convertConnectionInfoToHeaders(connectionInfo)
            }
        },
        url: "http://127.0.0.1:3000/v1/tables/"
    }
}