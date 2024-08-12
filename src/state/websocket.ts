export enum WEBSOCKET_EVENT {
    OPEN = 'open',
    CLOSE = 'close',
    MESSAGE = 'message'
}

export enum WEBSOCKET_MESSAGE_TYPE {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
    CONNECT = 'CONNECT',
    GET_TABLE = 'GET_TABLE',
    GET_TABLES = 'GET_TABLES',
    INSERT_RECORD = 'INSERT_RECORD',
    DELETE_RECORD = 'DELETE_RECORD'
}

export enum STATUS_CODE {
    BAD_REQUEST = 400,
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}

export type WebSocketRequest<T = unknown> = {
    payload: T
    type: WEBSOCKET_MESSAGE_TYPE
}

export type WebSocketResponse<T = unknown> = WebSocketRequest<T> & {
    statusCode: STATUS_CODE
}

export type WebSocketEvent<T = unknown> = WebSocketResponse<T> & {
    event: WEBSOCKET_EVENT
}

type SubscriberFn = (value: WebSocketEvent) => void

const createWebsocket = (url?: string) => {
    let ws: WebSocket | undefined
    let subscribers: Record<number, SubscriberFn> = {}
    let subIndex = 0

    const notifySubs = (message: WebSocketEvent) => {
        Object.values(subscribers).forEach(subFn => {
            subFn(message)
        })
    }

    const openHandler = () => {
        notifySubs({
            event: WEBSOCKET_EVENT.OPEN,
            payload: null,
            type: WEBSOCKET_MESSAGE_TYPE.OPEN,
            statusCode: STATUS_CODE.OK
        })
    }

    const closeHandler = () => {
        notifySubs({
            event: WEBSOCKET_EVENT.CLOSE,
            payload: null,
            type: WEBSOCKET_MESSAGE_TYPE.CLOSE,
            statusCode: STATUS_CODE.OK
        })
    }

    const messageHandler = (event: MessageEvent) => {
        let parsed: WebSocketResponse | undefined
        try {
            parsed = JSON.parse(event.data)
        } catch (error) {
            console.error(error)
        }
        if (!parsed) { return }

        notifySubs({
            event: WEBSOCKET_EVENT.MESSAGE,
            ...parsed
        })
    }

    const setup = (url: string) => {
        ws = new WebSocket(url)
        ws.addEventListener("open", openHandler)
        ws.addEventListener("close", closeHandler)
        ws.addEventListener("message", messageHandler)
    }

    const teardown = (ws: WebSocket) => {
        ws.removeEventListener("open", openHandler)
        ws.removeEventListener("close", closeHandler)
        ws.removeEventListener("message", messageHandler)
        ws.close(1000, 'Done')
    }

    if (url) { setup(url) }

    return {
        init: (url = "ws://localhost:3000/v1/") => {
            if (ws) { teardown(ws) }
            setup(url)
        },
        send: (message: WebSocketRequest) => {
            if (!ws) { return }
            ws.send(JSON.stringify(message))
        },
        close: () => {
            if (ws) {
                teardown(ws)
                closeHandler() 
            }
        },
        subscribe: (fn: SubscriberFn) => {
            const idx = subIndex
            subIndex = subIndex + 1

            subscribers[`${idx}`] = fn

            return () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [idx]: _, ...rest } = subscribers
                subscribers = rest
            }
        }
    }
}

export const websocket = createWebsocket()