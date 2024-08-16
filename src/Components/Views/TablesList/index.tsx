import { TableAction } from "./const"
import { TableListRow } from "./TableListRow"

export type TableListProps = {
    onTableAction: (data: TableAction) => void
    tables: string[]
}

export const TableList: React.FC<TableListProps> = ({
    onTableAction,
    tables
}) => {
    return (
        <>
            <h1>Table List</h1>
            {tables.map(tableName =>
                <TableListRow
                    key={tableName}
                    onTableAction={onTableAction}
                    tableName={tableName}
                />
            )}
        </>
    )
}
