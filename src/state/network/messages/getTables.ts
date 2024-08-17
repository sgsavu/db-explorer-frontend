import { SQLConnectionInfo } from "../../../Components/Views/Connect/ConnectForm/const"
import { MESSAGE_ALIAS, Request, Response, RejectionBody, STATUS_CODE } from "../consts"

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

export const createGetTablesRequest = (connect: SQLConnectionInfo): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_TABLES,
        config: {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/"
    }
}