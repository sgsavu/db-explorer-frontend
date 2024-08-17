import { Title } from "./Title"
import { RecordTable } from "./RecordTable"
import { RecordAction } from "./RecordTable/consts"

export type TableProps = {
    onRecordAction: (action: RecordAction) => void
    onTitleChange: (value: string) => void
    tableName: string
    tablePrimaryKeys: Array<string>
    tableRecords: Array<Record<string, string>>
}

export const Table: React.FC<TableProps> = ({
    onRecordAction,
    onTitleChange,
    tableName,
    tablePrimaryKeys,
    tableRecords
}) => {
    return (
        <>
            <Title onChange={onTitleChange} tableName={tableName} />
            <RecordTable
                onRecordAction={onRecordAction}
                primaryKeys={tablePrimaryKeys}
                entries={tableRecords}
            />
        </>
    )
}
