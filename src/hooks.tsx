import { useEffect, useState } from "react";
import { Subject } from "./state/subject";

export const useObservable = <T,>(observable: Subject<T>) => {
    const [value, setValue] = useState<T>()

    useEffect(() => {
        const sub = observable.subscribe(setValue)
        return () => { sub.unsubscribe() }
    }, [observable])

    return value
}