import './index.css'
import { Field } from '../../Components/Field'
import { useCallback, FormEventHandler, useEffect, useRef, useState } from 'react'
import { PROTOCOL, websocket, WEBSOCKET_MESSAGE_TYPE } from '../../state/websocket'
import { db, StorageDBConnect } from '../../state/localStorage'

websocket.subscribe(console.error)

export type DBConnect = {
  address: string
  dbName: string
  user: string
  password: string
}

type Props = {
  onConnect?: (data: DBConnect) => void
}

export const Form: React.FC<Props> = ({ onConnect }) => {
  const form = useRef<DBConnect>()
  const [recentLogins, setRecentLogins] = useState<Array<StorageDBConnect>>([])

  useEffect(() => {
    const cleanup = db.isOpen(isOpen => {
      if (isOpen) {
        db.dbGetAll()
          .then(setRecentLogins)
          .catch(console.error)
      }
    })

    return () => { cleanup() }
  }, [])

  useEffect(() => {
    const cleanup = websocket.subscribe(wsMessage => {
      if (wsMessage.type === WEBSOCKET_MESSAGE_TYPE.OPEN && form.current) {
        websocket.send({
          protocol: PROTOCOL.CONNECT,
          payload: form.current
        })
      }
    })
    return () => { cleanup() }
  }, [])

  const onRecentLogin = (login: StorageDBConnect) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = login
    form.current = rest
    websocket.init()
  }

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(e => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const formEntries = Object.fromEntries(formData.entries()) as DBConnect & { port: string }

    formEntries.address = formEntries.address + ':' + formEntries.port

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { port, ...rest } = formEntries

    form.current = rest
    onConnect?.(rest)
    websocket.init()
  }, [onConnect])

  return (
    <>
      <h1>MySQL Visualizer</h1>
      <form onSubmit={onSubmit}>
        <Field
          defaultValue="127.0.0.1"
          id='address'
          label='Address'
          name='address'
          required
        />

        <Field
          defaultValue="3306"
          id='port'
          label='Port'
          name='port'
          required
        />

        <Field
          id='dbName'
          label='DB Name'
          name='dbName'
          required
        />

        <Field
          defaultValue="root"
          id='user'
          label='User'
          name='user'
          required
        />

        <Field
          id='password'
          label='Password'
          name='password'
          type='password'
          required
        />

        <div>
          <button type='submit'>Connect</button>
        </div>
      </form>

      {recentLogins.length !== 0 && <h3>Recent logins</h3>}
      {recentLogins.map(login =>
          <button
            key={login.id}
            onClick={() => onRecentLogin(login)}
          >
            <div>
              {login.id}
            </div>
            {login.address} - {login.dbName} - {login.user} - {login.password[0]}{login.password[1]}{'*'.repeat(login.password.length - 2)}
          </button>
        )}
    </>
  )
}