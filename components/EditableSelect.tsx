import React, { FC, useState } from 'react'
import { Text } from '@react-pdf/renderer'
import compose from '../styles/compose'

export interface SelectOption {
  value: string
  text: string
}

interface Props {
  className?: string
  options?: SelectOption[]
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  pdfMode?: boolean
  prefix?: string
  otherValue?: string
  otherOnChange?: (value: string) => void
}

const EditableSelect: FC<Props> = ({
  className,
  options,
  placeholder,
  value,
  onChange,
  pdfMode,
  prefix = "",
  otherValue,
  otherOnChange
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  return (
    <>
      {pdfMode ? (
        <Text style={compose((className ? className : ''))}>{prefix ? <Text style={compose("bold")}>{prefix}</Text>: ""}{value}{otherValue ? `. ${otherValue}` : ""}</Text>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          {prefix ? <span className={"bold"}>{prefix}</span>: ""}
          <>
            <select
              className={'select ' + (className ? className : '')}
              value={value}
              onChange={onChange ? (e) => onChange(e.target.value) : undefined}
              // onBlur={() => setIsEditing(false)}
              // autoFocus={true}
              style={{ flex: 1 }}
            >
              {options?.map((option) => (
                <option key={option.text} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
            {value === "其他" && (
              <input
                type="text"
                className={'input ' + (className ? className : '')}
                placeholder={"內容" || ''}
                style={{ flex: 2 }}
                value={otherValue || ""}
                onChange={otherOnChange ? (e) => otherOnChange(e.target.value) : undefined}
              />
            )}
          </>
        </div>
      )}
    </>
  )
}

export default EditableSelect
