import { useRef } from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = props => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <input
      {...props}
      ref={inputRef}
      onClick={() => inputRef.current?.select()}
    />
  )
}