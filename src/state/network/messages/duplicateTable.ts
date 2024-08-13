import { DBConnect } from "../../../App/Connect"
import { MESSAGE_ALIAS, Request, Response, RejectionBody, STATUS_CODE } from "../consts"

export type DuplicateTableResponseBody = {
    result: Array<string>
}

export const isDuplicateTableRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.DUPLICATE_TABLE

export const isDuplicateTableResponse = (response: Response): response is Response<DuplicateTableResponseBody> =>
    response.alias === MESSAGE_ALIAS.DUPLICATE_TABLE &&
    response.statusCode === STATUS_CODE.OK

export const isDuplicateTableRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.DUPLICATE_TABLE &&
    response.statusCode !== STATUS_CODE.OK

export const createDuplicateTableRequest = (connect: DBConnect, sourceTableName: string, newTableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.DUPLICATE_TABLE,
        config: {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connect, sourceTableName, newTableName }),
        },
        url: "http://127.0.0.1:3000/v1/tables/"
    }
}