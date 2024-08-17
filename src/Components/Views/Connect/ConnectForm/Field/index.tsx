import { Input, InputProps } from "../../../../Input"
import styles from "./index.module.css"

export type FieldProps = InputProps & {
  label: string
}

export const Field: React.FC<FieldProps> = ({
    id,
    label,
    ...rest
}) => {
    return (
        <div className={styles.container}>
            <label htmlFor={id}>{label}:</label>
            <Input
                {...rest}
                id={id}
            />
        </div>
    )
}
