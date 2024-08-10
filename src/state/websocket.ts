type SubscriberFn = (value: WebSocketResponse) => void

export enum WEBSOCKET_MESSAGE_TYPE {
    OPEN = 'open',
    CLOSE = 'close',
    MESSAGE = 'message'
}

export enum PROTOCOL {
    CONNECT = 'CONNECT',
    GET_TABLES = 'GET_TABLES',
    GET_TABLE = 'GET_TABLE',
    DELETE_RECORD = 'DELETE_RECORD'
}

export type WebSocketMessage<T = unknown> = {
    protocol: PROTOCOL
    payload: T
}

export type WebSocketResponse<T = unknown> = WebSocketMessage<T> & {
    type: WEBSOCKET_MESSAGE_TYPE
}

type GetTablePayload = Array<Record<string, unknown>>

type GetTablesPayload = Array<string>

type ConnectResponsePayload = {
    message: string
    statusCode: number
}

export const isConnectResponse = (message: WebSocketResponse): message is WebSocketResponse<ConnectResponsePayload> =>
    message.type === WEBSOCKET_MESSAGE_TYPE.MESSAGE &&
    message.protocol === PROTOCOL.CONNECT

export const isGetTablesResponse = (message: WebSocketResponse): message is WebSocketResponse<GetTablesPayload> =>
    message.type === WEBSOCKET_MESSAGE_TYPE.MESSAGE &&
    message.protocol === PROTOCOL.GET_TABLES

export const isGetTableResponse = (message: WebSocketResponse): message is WebSocketResponse<GetTablePayload> =>
    message.type === WEBSOCKET_MESSAGE_TYPE.MESSAGE &&
    message.protocol === PROTOCOL.GET_TABLE

const createWebsocket = (url?: string) => {
    let ws: WebSocket | undefined
    let subscribers: Record<number, SubscriberFn> = {}
    let subIndex = 0

    const notifySubs = (message: WebSocketResponse) => {
        Object.values(subscribers).forEach(subFn => {
            subFn(message)
        })
    }

    const openHandler = () => {
        notifySubs({
            type: WEBSOCKET_MESSAGE_TYPE.OPEN
        })
    }

    const closeHandler = () => {
        notifySubs({
            type: WEBSOCKET_MESSAGE_TYPE.CLOSE
        })
    }

    const messageHandler = (event: MessageEvent) => {
        let parsed: WebSocketMessage | undefined
        try {
            parsed = JSON.parse(event.data)
        } catch (error) {
            console.error(error)
        }
        if (!parsed) { return }

        notifySubs({
            type: WEBSOCKET_MESSAGE_TYPE.MESSAGE,
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
        ws.close(1000, 'Bye')
    }

    if (url) { setup(url) }

    return {
        init: (url = "ws://localhost:3000/v1/") => {
            if (ws) { teardown(ws) }
            setup(url)
        },
        send: (message: WebSocketMessage) => {
            console.warn(message)
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