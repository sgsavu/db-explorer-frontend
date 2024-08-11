import './index.css'
import { Field } from '../../Components/Field'
import { FormEventHandler, useEffect, useState } from 'react'
import { localStorage, StorageDBConnect } from '../../state/localStorage'
import { createGetTablesRequest, isGetTablesRejection, isGetTablesRequest, network } from '../../state/network'
import { connect$ } from '../../state/connect'

export type DBConnect = {
  address: string
  dbName: string
  user: string
  password: string
}

const onRecentLogin = (login: StorageDBConnect) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = login

  connect$.next(rest)
  network.out.send(createGetTablesRequest(rest))
}

const onSubmit: FormEventHandler<HTMLFormElement> = e => {
  e.preventDefault()

  const formData = new FormData(e.target as HTMLFormElement)
  const formEntries = Object.fromEntries(formData.entries()) as DBConnect & { port: string }

  formEntries.address = formEntries.address + ':' + formEntries.port
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { port, ...rest } = formEntries

  connect$.next(rest)
  network.out.send(createGetTablesRequest(rest))
}

export const Connect: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [recentLogins, setRecentLogins] = useState<Array<StorageDBConnect>>([])

  useEffect(() => {
    const cleanup = localStorage.isOpen(isOpen => {
      if (isOpen) {
        localStorage.dbGetAll()
          .then(setRecentLogins)
          .catch(console.error)
      }
    })

    return () => { cleanup() }
  }, [])

  useEffect(() => {
    const sub = network.in.listen(resp => {
      if (isGetTablesRejection(resp)) {
        setError(resp.body.error)
      }
    })
    return () => { sub.unsubscribe() }
  }, [])

  useEffect(() => {
    const sub = network.out.listen(request => {
      if (isGetTablesRequest(request)) {
        setError(null)
      }
    })
    return () => { sub.unsubscribe() }
  }, [])

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

      <div>
        {error}
      </div>

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