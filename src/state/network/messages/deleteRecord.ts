import { DBConnect } from "../../../App/Connect"
import { MESSAGE_ALIAS, Request, Response, RejectionBody, STATUS_CODE } from "../consts"

export type DeleteRecordResponseBody = {
    result: Array<Record<string, string>>
}

export const isDeleteRecordRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.DELETE_RECORD

export const isDeleteRecordResponse = (response: Response): response is Response<DeleteRecordResponseBody> =>
    response.alias === MESSAGE_ALIAS.DELETE_RECORD &&
    response.statusCode === STATUS_CODE.OK

export const isDeleteRecordRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.DELETE_RECORD &&
    response.statusCode !== STATUS_CODE.OK

export const createDeleteRecordRequest = (connect: DBConnect, tableName: string, recordId: string): Request => {
    return {
        alias: MESSAGE_ALIAS.DELETE_RECORD,
        config: {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/" + recordId + "/"
    }
}