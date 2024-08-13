import { deleteRecord, duplicateRecord, editRecord } from "../utils"
import { EditableCell } from "./EditableCell"
import tableStyles from "../index.module.css"
import styles from "./index.module.css"

type Props = {
    row: Record<string, string>
}

export const Row: React.FC<Props> = ({ row }) => {
    const columns = Object.keys(row)
    const values = Object.values(row)

    const onEdit = (newValue: string, columnIndex: number) => {
        editRecord(row, columns[columnIndex], newValue)
    }

    return (
        <tr>
            {values.map((value, columnIndex) =>
                <EditableCell
                    onEdit={newValue => onEdit(newValue, columnIndex)}
                    key={columnIndex}
                    value={value}
                />
            )}
            <td className={tableStyles.hoverableCell} onClick={() => duplicateRecord(row)}>
                <div className={styles.duplicateButton}>
                    ⎘
                </div>
            </td>
            <td className={tableStyles.hoverableCell} onClick={() => deleteRecord(row)}>
                ❌
            </td>
        </tr>
    )
}
