import './index.css'
import { Field } from '../../Components/Field'
import { useCallback, FormEventHandler, useEffect, useRef } from 'react'
import { PROTOCOL, websocket, WEBSOCKET_MESSAGE_TYPE } from '../../state/websocket'

websocket.subscribe(console.error)

type Form = {
  address: string
  dbName: string
  user: string
  password: string
}

export const Form = () => {
  const form = useRef<Form>()

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

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(e => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const formEntries = Object.fromEntries(formData.entries()) as Form & { port: string }

    formEntries.address = formEntries.address + ':' + formEntries.port

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { port, ...rest} = formEntries

    form.current = rest

    websocket.init()
  }, [])

  return (
    <>
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
    </>
  )
}