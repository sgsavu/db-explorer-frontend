import { useState } from "react"
import { Input } from "../../../../Components/Input"
import { editRecord } from "../../utils"
import tableStyles from "../../index.module.css"
import styles from "./index.module.css"

type Props = {
    columnField: string
    value: string
}

export const EditableCell: React.FC<Props> = ({
    columnField,
    value
}) => {
    const [isEditing, setIsEditing] = useState(false)

    const onInputBlur: React.FocusEventHandler<HTMLInputElement> = e => {
        setIsEditing(false)

        const newValue = e.target.value
        if (newValue === value) { return }

        editRecord(columnField, newValue)
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
        <td
            className={isEditing ? styles.inputCell : tableStyles.hoverableCell}
            key={value}
            onFocus={() => { setIsEditing(true) }}
            tabIndex={0}
        >
            {isEditing
                ? (
                    <Input
                        clickOnRender
                        defaultValue={value}
                        onBlur={onInputBlur}
                        onKeyDown={onInputKeyDown}
                        required
                        type="text"
                    />
                )
                : (
                    <div>
                        {value}
                    </div>
                )
            }
        </td>
    )
}
