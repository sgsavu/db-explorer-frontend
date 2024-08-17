import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "../../../Components/Views/Connect/ConnectForm/const"
import { MESSAGE_ALIAS, RejectionBody } from "../consts"

export type GetTableResponseBody = {
    result: Array<Record<string, string>>
}

export const isGetTableRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.GET_TABLE

export const isGetTableResponse = (response: Response): response is Response<GetTableResponseBody> =>
    response.alias === MESSAGE_ALIAS.GET_TABLE &&
    response.statusCode === STATUS_CODE.OK

export const isGetTableRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.GET_TABLE &&
    response.statusCode !== STATUS_CODE.OK

export const createGetTableRequest = (connect: SQLConnectionInfo, tableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_TABLE,
        config: {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/records/"
    }
}