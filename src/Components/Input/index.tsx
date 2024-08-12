import { useEffect, useRef } from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clickOnRender?: boolean
}

export const Input: React.FC<InputProps> = ({ clickOnRender, ...rest}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (clickOnRender) {
      inputRef.current?.click()
    }
  }, [clickOnRender])

  return (
    <input
      {...rest}
      ref={inputRef}
      onClick={() => inputRef.current?.select()}
    />
  )
}