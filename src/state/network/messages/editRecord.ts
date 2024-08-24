import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"
import { MESSAGE_ALIAS, RejectionBody } from "../consts"

export type EditRecordResponseBody = {
    result: Array<Record<string, string>>
}

export const isEditRecordRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.EDIT_RECORD

export const isEditRecordResponse = (response: Response): response is Response<EditRecordResponseBody> =>
    response.alias === MESSAGE_ALIAS.EDIT_RECORD &&
    response.statusCode === STATUS_CODE.OK

export const isEditRecordRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.EDIT_RECORD &&
    response.statusCode !== STATUS_CODE.OK

export const createEditRecordRequest = (connectionInfo: SQLConnectionInfo, tableName: string, field: string, value: string, primaryKey: string, recordId: string): Request => {
    return {
        alias: MESSAGE_ALIAS.EDIT_RECORD,
        config: {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                connectionInfo, 
                update: {
                    column: field,
                    value
                },
                recordInfo: {
                    column: primaryKey,
                    value: recordId
                }
            }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/"
    }
}