import { deleteTable, duplicateTable, fetchTableList, selectTable } from "./utils"
import styles from "./index.module.css"

type Props = {
  onBack?: () => void
  tables: string[]
}

export const TableList: React.FC<Props> = ({
    onBack,
    tables
}) => {
    return (
        <>
            <div>
                <button onClick={onBack}>Back ↩️</button>
                <button onClick={fetchTableList}>Refresh 🔄</button>
            </div>
            <h1>Tables</h1>
            {tables.map(table =>
                <div className={styles.entry} key={table}>
                    <button onClick={() => selectTable(table)}>
                        {table}
                    </button>
                    <div>
                        <button onClick={() => duplicateTable(table)}>
                        ⎘
                        </button>
                        <button onClick={() => deleteTable(table)}>
                        ❌
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
