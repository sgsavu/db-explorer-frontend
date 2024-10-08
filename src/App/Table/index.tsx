import { Table as TableComponent, TableProps, RECORD_TABLE_ACTION, RecordAction } from "@sgsavu/db-explorer-components"
import { deleteRecord, duplicateRecord, editRecord, insertRecord, renameTable } from "./utils"
import { useObservable } from "../../hooks"
import { selectedTable$ } from "../../state/selectedTable"
import { primaryKeys$ } from "../../state/primaryKeys"

const onRecordAction = (data: RecordAction) => {
    const {
        action,
        columnName,
        columnValue,
        record
    } = data

    switch (action) {
    case RECORD_TABLE_ACTION.INSERT:
        insertRecord(record)
        break
    case RECORD_TABLE_ACTION.DUPLICATE:
        duplicateRecord(record)
        break
    case RECORD_TABLE_ACTION.DELETE:
        deleteRecord(record)
        break
    case RECORD_TABLE_ACTION.EDIT:
        if (!columnName || !columnValue) { return }
        editRecord(record, columnName, columnValue)
        break
    }
}

type Props = Pick<TableProps, "tableRecords">

export const Table: React.FC<Props> = props => {
    const primaryKeys = useObservable(primaryKeys$) ?? []
    const selectedTable =  useObservable(selectedTable$) ?? ""

    return (
        <TableComponent
            {...props}
            onTitleChange={renameTable}
            onRecordAction={onRecordAction}
            tableName={selectedTable}
            tablePrimaryKeys={primaryKeys}
        />
    )
}
