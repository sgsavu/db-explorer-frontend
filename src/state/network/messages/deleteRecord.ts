import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { MESSAGE_ALIAS } from "../consts"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"
import { RejectionBody, TableRecord } from "../types"
import { convertConnectionInfoToHeaders } from "../utils"

export type DeleteRecordResponseBody = {
    result: Array<TableRecord>
}

export const isDeleteRecordRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.DELETE_RECORD

export const isDeleteRecordResponse = (response: Response): response is Response<DeleteRecordResponseBody> =>
    response.alias === MESSAGE_ALIAS.DELETE_RECORD &&
    response.statusCode === STATUS_CODE.OK

export const isDeleteRecordRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.DELETE_RECORD &&
    response.statusCode !== STATUS_CODE.OK

export const createDeleteRecordRequest = (connectionInfo: SQLConnectionInfo, tableName: string, record: Record<string, string>): Request => {
    return {
        alias: MESSAGE_ALIAS.DELETE_RECORD,
        config: {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                ...convertConnectionInfoToHeaders(connectionInfo)
            },
            body: JSON.stringify({ record }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/"
    }
}