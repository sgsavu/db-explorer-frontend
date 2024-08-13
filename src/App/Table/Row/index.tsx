import { deleteRecord, duplicateRecord } from "../utils"
import { EditableCell } from "./EditableCell"
import tableStyles from "../index.module.css"
import styles from "./index.module.css"

type Props = {
    row: Record<string, string>
    index: number
}

export const Row: React.FC<Props> = ({
    row,
    index
}) => {
    const columns = Object.keys(row)
    const values = Object.values(row)

    return (
        <tr key={`row-${index}`}>
            {values.map((value, columnIndex) =>
                <EditableCell
                    columnField={columns[columnIndex]}
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
