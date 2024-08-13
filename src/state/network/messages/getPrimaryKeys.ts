import { DBConnect } from "../../../App/Connect"
import { MESSAGE_ALIAS, Request, Response, RejectionBody, STATUS_CODE } from "../consts"

export type GetPrimaryKeysResponseBody = {
    result: Array<string>
}

export const isGetPrimaryKeysRequest = (request: Request): request is Request =>
    request.alias === MESSAGE_ALIAS.GET_PRIMARY_KEYS

export const isGetPrimaryKeysResponse = (response: Response): response is Response<GetPrimaryKeysResponseBody> =>
    response.alias === MESSAGE_ALIAS.GET_PRIMARY_KEYS &&
    response.statusCode === STATUS_CODE.OK

export const isGetPrimaryKeysRejection = (response: Response): response is Response<RejectionBody> =>
    response.alias === MESSAGE_ALIAS.GET_PRIMARY_KEYS &&
    response.statusCode !== STATUS_CODE.OK

export const createGetPrimaryKeysRequest = (connect: DBConnect, tableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_PRIMARY_KEYS,
        config: {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connect }),
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/primary-keys/"
    }
}