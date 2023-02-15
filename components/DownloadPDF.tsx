import React, { FC, useEffect, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { tify, sify } from 'chinese-conv';

import { Invoice } from '../data/types'
import InvoicePage from './InvoicePage'

interface Props {
  data: Invoice
}

const Download: FC<Props> = ({ data }) => {
  const [show, setShow] = useState<boolean>(false)
  const [newData, setNewData] = useState<any>({ ...data })

  useEffect(() => {
    setShow(false)

    const timeout = setTimeout(() => {
      setShow(true)
    }, 500)

    if (data) {
      const obj = { ...data }
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === "string") {
          obj[key] = tify(obj[key])
        }
      })
      setNewData(obj)
    }

    return () => clearTimeout(timeout)
  }, [data])

  return (
    <div className={'download-pdf ' + (!show ? 'loading' : '')} title="Save PDF">
      {show && (
        <PDFDownloadLink
          document={<InvoicePage pdfMode={true} data={newData} />}
          fileName={`${data.heading ? data.heading : '發票'}${data.invoiceNumber ? data.invoiceNumber : ''}.pdf`}
          aria-label="Save PDF"
        ></PDFDownloadLink>
      )}
    </div>
  )
}

export default Download
