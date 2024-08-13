import { useState } from "react"
import { selectedTable$ } from "../../../state/selectedTable"
import { useObservable } from "../../../hooks"
import { Input } from "../../../Components/Input"
import { renameTable } from "../utils"
import styles from "./index.module.css"

export const Title: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false)
    const tableName = useObservable(selectedTable$) ?? ""

    const onInputBlur: React.FocusEventHandler<HTMLInputElement> = e => {
        setIsEditing(false)

        const newTableName = e.target.value
        if (newTableName === tableName) { return }

        renameTable(newTableName)
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
