type SubFn = <T>(value: T) => void

type Config<T> = {
    initValue?: T,
    replay?: number
}

export const createSubject = <T>(config?: Config<T>) => {
    const {
        initValue,
        replay
    } = config ?? {}

    const values: Array<T> = []
    let subscribers: Record<number, SubFn> = {}
    let subIndex = 0
    let terminated = false

    if (initValue) {
        values.push(initValue)
    }

    return {
        next: (value: T) => {
            if (terminated) return
            if (values.length === replay) {
                values.shift()
            }
            values.push(value)

            Object.values(subscribers).forEach(subscriber => {
                subscriber(value)
            })
        },
        subscribe: (fn: SubFn) => {
            const idx = subIndex
            subIndex = subIndex + 1
            subscribers[`${idx}`] = fn

            if (replay !== undefined) {
                const toBeReplayed = values.slice(-replay)
                toBeReplayed.forEach(fn)
            }

            return {
                unsubscribe: () => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [idx]: _, ...rest} = subscribers
                    subscribers = rest
                }
            }
        },
        getLatestValue: () => values[values.length - 1],
        terminate: () => {
            subscribers = {}
            terminated  = true
        }
    }
}

export type Subject<T> = ReturnType<typeof createSubject<T>>