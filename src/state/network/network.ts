import { handleError } from "../../utils"
import { Request, Response } from "./consts"

type InSubFn = (response: Response) => void
type OutSubFn = (request: Request) => void

export const createNetwork = () => {
    let outSubs: Record<number, OutSubFn> = {}
    let outSubIndex = 0

    let inSubs: Record<number, InSubFn> = {}
    let inSubIndex = 0

    const notifySubs = <X, T extends (message: X) => void>(subs: Record<number, T>, message: X) => {
        Object.values(subs).forEach(subscriber => {
            subscriber(message)
        })
    }

    return {
        out: ({
            send: (request: Request) => {
                notifySubs(outSubs, request)

                fetch(request.url, request.config)
                    .then(response =>
                        response.json()
                            .then(body => {
                                notifySubs(
                                    inSubs,
                                    {
                                        alias: request.alias,
                                        body,
                                        statusCode: response.status,
                                        url: request.url,
                                    }
                                )
                            })
                            .catch(handleError)
                    )
                    .catch(handleError)
            },
            listen: (fn: OutSubFn) => {
                const idx = outSubIndex
                outSubIndex += 1
                outSubs[`${idx}`] = fn

                return {
                    unsubscribe: () => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [idx]: _, ...rest } = outSubs
                        outSubs = rest
                    }
                }
            }
        }),
        in: ({
            listen: (fn: InSubFn) => {
                const idx = inSubIndex
                inSubIndex += 1
                inSubs[`${idx}`] = fn

                return {
                    unsubscribe: () => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [idx]: _, ...rest } = inSubs
                        inSubs = rest
                    }
                }
            }
        })
    }
}

export const network = createNetwork()