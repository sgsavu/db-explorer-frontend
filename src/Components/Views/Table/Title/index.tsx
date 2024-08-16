import { useState } from "react"
import styles from "./index.module.css"
import { Input } from "../../../Input"

export type TitleProps = {
    onChange: (value: string) => void
    tableName: string
}

export const Title: React.FC<TitleProps> = ({ onChange, tableName }) => {
    const [isEditing, setIsEditing] = useState(false)

    const onInputBlur: React.FocusEventHandler<HTMLInputElement> = e => {
        setIsEditing(false)

        const newTableName = e.target.value
        if (newTableName === tableName) { return }

        onChange(newTableName)
    }

    const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
        const key = e.key

        switch (key) {
        case "Enter":
            e.preventDefault()
            e.currentTarget.blur()
            break;
        case "Escape":
            setIsEditing(false)
            break;
        }
    }

    return (
        <h1>
            {isEditing
                ? (
                    <Input
                        clickOnRender
                        defaultValue={tableName}
                        onBlur={onInputBlur}
                        onKeyDown={onInputKeyDown}
                        required
                        type="text"
                    />
                )
                : (
                    <div className={styles.value} onClick={() => setIsEditing(true)}>
                        {tableName}
                    </div>
                )
            }
        </h1>
    )
}
