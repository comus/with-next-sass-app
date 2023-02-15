import React, { FC, useEffect, useRef, useState } from 'react'
import { Image } from '@react-pdf/renderer'
import compose from '../styles/compose'
import 'rc-slider/assets/index.css'

interface Props {
  className?: string
  placeholder?: string
  value?: string
  width?: number
  onChangeImage?: (value: string) => void
  onChangeWidth?: (value: number) => void
  pdfMode?: boolean
}

const EditableFileImage: FC<Props> = ({ className, placeholder, value, width, onChangeImage, onChangeWidth, pdfMode }) => {
  if (pdfMode) {
    return (
      <Image
        style={{...compose(`image ${className ? className : ''}`), maxWidth: 140}}
        src={"/images/logo.png"}
      />
    )
  }

  return (
    <div className={`image ${value ? 'mb-5' : ''} ${className ? className : ''}`}>
      <>
        <img
          src={"/images/logo.png"}
          className="image__img"
          alt={placeholder}
          style={{ maxWidth: 140}}
        />
      </>
    </div>
  )
}

export default EditableFileImage
