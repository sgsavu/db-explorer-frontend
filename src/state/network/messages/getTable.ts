import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"
import { MESSAGE_ALIAS } from "../consts"
import { RejectionBody, TableRecord } from "../types"
import { convertConnectionInfoToHeaders } from "../utils"

export type GetTableResponseBody = {
    result: Array<TableRecord>
}

export const isGetTableRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.GET_TABLE

export const isGetTableResponse = (response: Response): response is Response<GetTableResponseBody> =>
    response.alias === MESSAGE_ALIAS.GET_TABLE &&
    response.statusCode === STATUS_CODE.OK

export const isGetTableRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.GET_TABLE &&
    response.statusCode !== STATUS_CODE.OK

export const createGetTableRequest = (connectionInfo: SQLConnectionInfo, tableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_TABLE,
        config: {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                ...convertConnectionInfoToHeaders(connectionInfo)
            }
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/"
    }
}