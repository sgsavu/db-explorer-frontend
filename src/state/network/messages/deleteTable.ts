import { SQLConnectionInfo } from "../../../Components/Views/Connect/ConnectForm/const"
import { MESSAGE_ALIAS, Request, Response, RejectionBody, STATUS_CODE } from "../consts"

export type DeleteTableResponseBody = {
    result: Array<string>
}

export const isDeleteTableRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.DELETE_TABLE

export const isDeleteTableResponse = (response: Response): response is Response<DeleteTableResponseBody> =>
    response.alias === MESSAGE_ALIAS.DELETE_TABLE &&
    response.statusCode === STATUS_CODE.OK

export const isDeleteTableRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.DELETE_TABLE &&
    response.statusCode !== STATUS_CODE.OK

export const createDeleteTableRequest = (connect: SQLConnectionInfo, tableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.DELETE_TABLE,
        config: {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/"
    }
}