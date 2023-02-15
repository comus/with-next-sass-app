import React, { FC } from 'react'
import { Text } from '@react-pdf/renderer'
import compose from '../styles/compose'

interface Props {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  pdfMode?: boolean,
  readOnly?: boolean,
  prefix?: string,
  list?: any,
  options?: any
}

const EditableInput: FC<Props> = ({ className, placeholder, value, onChange, pdfMode, readOnly = false, prefix = "", list, options }) => {
  if (!pdfMode && readOnly) {
    return (
      <p className={(className ? className : '')} style={{ margin: 0 }}>
        {prefix ? <span className={"bold"}>{prefix}</span>: ""}{value}
      </p>
    )
  }

  return (
    <>
      {pdfMode ? (
        <Text style={compose((className ? className : ''))}>{prefix ? <Text style={compose("bold")}>{prefix}</Text>: ""}{value}</Text>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          {prefix ? <span className={"bold"}>{prefix}</span>: ""}
          <input
            type="text"
            className={'input ' + (className ? className : '')}
            placeholder={placeholder || ''}
            value={value || ''}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            style={{ flex: 1 }}
            list={list}
          />
          {!!list && (
            <datalist id={list}>
              {options.map(option => {
                return (
                  <option key={option.value} value={option.value}>{option.text}</option>
                )
              })}
            </datalist>
          )}
        </div>
      )}
    </>
  )
}

export default EditableInput
