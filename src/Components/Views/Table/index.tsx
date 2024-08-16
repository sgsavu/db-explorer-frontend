import { Title } from "./Title"
import { RecordTable } from "./RecordTable"
import { RecordAction, SORT_MODE } from "./RecordTable/consts"

export type TableProps = {
    onRecordAction: (action: RecordAction) => void
    onTableSort: (key: string, sortMode: SORT_MODE) => void
    onTitleChange: (value: string) => void
    tableName: string
    tablePrimaryKeys: Array<string>
    tableRecords: Array<Record<string, string>>
}

export const Table: React.FC<TableProps> = ({
    onRecordAction,
    onTableSort,
    onTitleChange,
    tableName,
    tablePrimaryKeys,
    tableRecords
}) => {
    return (
        <>
            <Title onChange={onTitleChange} tableName={tableName} />
            <RecordTable
                onSort={onTableSort}
                onRecordAction={onRecordAction}
                primaryKeys={tablePrimaryKeys}
                entries={tableRecords}
            />
        </>
    )
}
