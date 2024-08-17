import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "../../../Components/Views/Connect/ConnectForm/const"
import { MESSAGE_ALIAS, RejectionBody } from "../consts"

export type InsertRecordResponseBody = {
    result: Array<Record<string, string>>
}

export const isInsertRecordRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.INSERT_RECORD

export const isInsertRecordResponse = (response: Response): response is Response<InsertRecordResponseBody> =>
    response.alias === MESSAGE_ALIAS.INSERT_RECORD &&
    response.statusCode === STATUS_CODE.OK

export const isInsertRecordRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.INSERT_RECORD &&
    response.statusCode !== STATUS_CODE.OK

export const createInsertRecordRequest = (connect: SQLConnectionInfo, tableName: string, record: Array<string>): Request => {
    return {
        alias: MESSAGE_ALIAS.INSERT_RECORD,
        config: {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connect, record }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/"
    }
}