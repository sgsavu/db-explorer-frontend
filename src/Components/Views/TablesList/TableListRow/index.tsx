import { TABLE_LIST_ACTION, TableAction } from "../const"
import styles from "./index.module.css"

export type TableListRowProps = {
    onTableAction: (data: TableAction) => void
    tableName: string
}

export const TableListRow: React.FC<TableListRowProps> = ({
    onTableAction,
    tableName
}) => {
    return (
        <div className={styles.entry}>
            <button onClick={() => onTableAction({ action: TABLE_LIST_ACTION.SELECT, tableName })}>
                {tableName}
            </button>
            <div>
                <button onClick={() => onTableAction({ action: TABLE_LIST_ACTION.DUPLICATE, tableName })}>
                    ⎘
                </button>
                <button onClick={() => onTableAction({ action: TABLE_LIST_ACTION.DELETE, tableName })}>
                    ❌
                </button>
            </div>
        </div>
    )
}
