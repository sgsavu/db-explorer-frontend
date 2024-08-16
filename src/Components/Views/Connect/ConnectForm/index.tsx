import { FormEventHandler } from "react"
import { Field } from "../../../Field"
import { SQLConnectionInfo } from "./const"

export type ConnectFormProps = {
    onConnect: (connectionInfo: SQLConnectionInfo) => void
}

export const ConnectForm: React.FC<ConnectFormProps> = ({ onConnect }) => {
    const onSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)
        const formEntries = Object.fromEntries(formData.entries()) as SQLConnectionInfo & { port: string }

        formEntries.address = formEntries.address + ":" + formEntries.port
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { port, ...connectionInfo } = formEntries

        onConnect(connectionInfo)
    }

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