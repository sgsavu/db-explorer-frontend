import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"
import { MESSAGE_ALIAS } from "../consts"
import { RejectionBody, TableRecord } from "../types"
import { convertConnectionInfoToHeaders } from "../utils"

export type DuplicateRecordResponseBody = {
    result: Array<TableRecord>
}

export const isDuplicateRecordRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.DUPLICATE_RECORD

export const isDuplicateRecordResponse = (response: Response): response is Response<DuplicateRecordResponseBody> =>
    response.alias === MESSAGE_ALIAS.DUPLICATE_RECORD &&
    response.statusCode === STATUS_CODE.OK

export const isDuplicateRecordRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.DUPLICATE_RECORD &&
    response.statusCode !== STATUS_CODE.OK

export const createDuplicateRecordRequest = (connectionInfo: SQLConnectionInfo, tableName: string, record: Record<string, string>): Request => {
    return {
        alias: MESSAGE_ALIAS.DUPLICATE_RECORD,
        config: {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...convertConnectionInfoToHeaders(connectionInfo)
            },
            body: JSON.stringify({ record }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/duplicate/"
    }
}