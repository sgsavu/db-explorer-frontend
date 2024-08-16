/*
    IndexedDB is probably one of the worst apis known to man. 
    Luckily I am one of the best programmers of all time and I have made it easy to use.
*/

import { SQLConnectionInfo } from "../Components/Views/Connect/ConnectForm/const"
import { RecentSQLConnectionInfo } from "../Components/Views/Connect/RecentConnections/const"

const INDEXED_DB = "mysql-visualizer"
const OBJECT_STORE = "logins"

type SubscriberFn = (value: boolean) => void

const createIndexedDB = (dbName: string, objectStore: string) => {
    let db: null | IDBDatabase = null
    let open = false
    let openSubs: Record<number, SubscriberFn> = {}
    let subIndex = 0

    const notifySubs = (message: boolean) => {
        Object.values(openSubs).forEach(subFn => {
            subFn(message)
        })
    }

    const request = indexedDB.open(dbName)

    request.onerror = () => { console.error("Unable to open indexedDB.") }
    request.onsuccess = () => { 
        db = request.result
        open = true
        notifySubs(true)
    }
    request.onupgradeneeded = (event) => {
        const target = event.target as EventTarget & { result: IDBDatabase };

        const db = target.result;
        db.createObjectStore(objectStore, { keyPath: "id" });
    };

    return {
        isOpen: (fn: SubscriberFn) => {
            fn(open)
            const idx = subIndex
            subIndex = subIndex + 1

            openSubs[`${idx}`] = fn

            return () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [idx]: _, ...rest } = openSubs
                openSubs = rest
            }
        },
        set: (value: RecentSQLConnectionInfo) =>
            new Promise<IDBValidKey>((resolve, reject) => {
                if (!db) { reject("Unable to add to indexedDB."); return }

                const request = db
                    .transaction([OBJECT_STORE], "readwrite")
                    .objectStore(OBJECT_STORE)
                    .put(value)

                request.onsuccess = () => { resolve(request.result) }
                request.onerror = () => { reject(request.error) }
            }),
        get: (id: RecentSQLConnectionInfo["id"]) =>
            new Promise<SQLConnectionInfo>((resolve, reject) => {
                if (!db) { reject("Unable to get from indexedDB."); return }

                const request = db
                    .transaction([OBJECT_STORE], "readonly")
                    .objectStore(OBJECT_STORE)
                    .get(id) as IDBRequest<RecentSQLConnectionInfo>

                request.onsuccess = () => { resolve(request.result) }
                request.onerror = () => { reject(request.error) }
            }),
        dbGetAll: () =>
            new Promise<Array<RecentSQLConnectionInfo>>((resolve, reject) => {
                if (!db) { reject("Unable to get from indexedDB."); return }

                const request = db
                    .transaction([OBJECT_STORE], "readonly")
                    .objectStore(OBJECT_STORE)
                    .getAll() as IDBRequest<Array<RecentSQLConnectionInfo>>

                request.onsuccess = () => { resolve(request.result) }
                request.onerror = () => { reject(request.error) }
            }),
        dbRemove: (id: RecentSQLConnectionInfo["id"]) =>
            new Promise<undefined>((resolve, reject) => {
                if (!db) { reject("Unable to remove from indexedDB."); return }

                const request = db
                    .transaction([OBJECT_STORE], "readwrite")
                    .objectStore(OBJECT_STORE)
                    .delete(id)

                request.onsuccess = () => { resolve(request.result) }
                request.onerror = () => { reject(request.error) }
            })
    }
}

export const localStorage = createIndexedDB(INDEXED_DB, OBJECT_STORE)
