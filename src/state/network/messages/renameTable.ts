import { SQLConnectionInfo } from "../../../Components/Views/Connect/ConnectForm/const"
import { MESSAGE_ALIAS, Request, Response, RejectionBody, STATUS_CODE } from "../consts"

export type EditTableNameResponseBody = {
    result: Array<string>
}

export const isRenameTableRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.EDIT_TABLE_NAME

export const isRenameTableResponse = (response: Response): response is Response<EditTableNameResponseBody> =>
    response.alias === MESSAGE_ALIAS.EDIT_TABLE_NAME &&
    response.statusCode === STATUS_CODE.OK

export const isRenameTableRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.EDIT_TABLE_NAME &&
    response.statusCode !== STATUS_CODE.OK

export const createRenameTableRequest = (connect: SQLConnectionInfo, oldTableName: string, newTableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.EDIT_TABLE_NAME,
        config: {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connect, newTableName }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + oldTableName + "/"
    }
}