import { EditableCell } from "./EditableCell"
import tableStyles from "../index.module.css"
import styles from "./index.module.css"
import { RECORD_TABLE_ACTION, RecordAction } from "../consts"

type Props = {
    onRowAction: (action: RecordAction) => void
    row: Record<string, string>
}

export const Row: React.FC<Props> = ({
    onRowAction, 
    row 
}) => {
    const columns = Object.keys(row)
    const values = Object.values(row)

    return (
        <tr>
            {values.map((value, columnIndex) =>
                <EditableCell
                    onEdit={newValue => onRowAction({ action: RECORD_TABLE_ACTION.DUPLICATE, columnName: columns[columnIndex], columnValue: newValue, record: row})}
                    key={columnIndex}
                    value={value}
                />
            )}
            <td className={tableStyles.hoverableCell} onClick={() => onRowAction({ action: RECORD_TABLE_ACTION.DUPLICATE, record: row})}>
                <div className={styles.duplicateButton}>
                    ⎘
                </div>
            </td>
            <td className={tableStyles.hoverableCell} onClick={() => onRowAction({ action: RECORD_TABLE_ACTION.DELETE, record: row})}>
                ❌
            </td>
        </tr>
    )
}
