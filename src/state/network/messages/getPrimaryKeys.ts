import { Request, Response, STATUS_CODE } from "@sgsavu/io"
import { SQLConnectionInfo } from "@sgsavu/db-explorer-components"
import { MESSAGE_ALIAS } from "../consts"
import { RejectionBody } from "../types"
import { convertConnectionInfoToHeaders } from "../utils"

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

export const createGetPrimaryKeysRequest = (connectionInfo: SQLConnectionInfo, tableName: string): Request => {
    return {
        alias: MESSAGE_ALIAS.GET_PRIMARY_KEYS,
        config: {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                ...convertConnectionInfoToHeaders(connectionInfo)
            }
        },
        url: "http://127.0.0.1:3000/v1/tables/" + tableName + "/primary-keys/"
    }
}