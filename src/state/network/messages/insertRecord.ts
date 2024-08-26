import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"
import { MESSAGE_ALIAS } from "../consts"
import { RejectionBody, TableRecord } from "../types"
import { convertConnectionInfoToHeaders } from "../utils"

export type InsertRecordResponseBody = {
    result: Array<TableRecord>
}

export const isInsertRecordRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.INSERT_RECORD

export const isInsertRecordResponse = (response: Response): response is Response<InsertRecordResponseBody> =>
    response.alias === MESSAGE_ALIAS.INSERT_RECORD &&
    response.statusCode === STATUS_CODE.OK

export const isInsertRecordRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.INSERT_RECORD &&
    response.statusCode !== STATUS_CODE.OK

export const createInsertRecordRequest = (connectionInfo: SQLConnectionInfo, tableName: string, record: Record<string, string>): Request => {
    return {
        alias: MESSAGE_ALIAS.INSERT_RECORD,
        config: {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...convertConnectionInfoToHeaders(connectionInfo)
            },
            body: JSON.stringify({ record }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/"
    }
}