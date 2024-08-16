import { TableList as TableListComponent } from "../../Components/Views/TablesList"
import { TABLE_LIST_ACTION, TableAction } from "../../Components/Views/TablesList/const"
import { deleteTable, duplicateTable, selectTable } from "./utils"

const onTableAction = (tableAction: TableAction) => {
    const { action, tableName } = tableAction

    switch (action) {
    case TABLE_LIST_ACTION.SELECT:
        selectTable(tableName)
        break
    case TABLE_LIST_ACTION.DUPLICATE:
        duplicateTable(tableName)
        break
    case TABLE_LIST_ACTION.DELETE:
        deleteTable(tableName)
        break
    }
}

type Props = { tables: string[] }

export const TableList: React.FC<Props> = ({ tables }) => {
    return (
        <TableListComponent
            onTableAction={onTableAction}
            tables={tables}
        />
    )
}
