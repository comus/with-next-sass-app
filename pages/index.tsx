import React, { useEffect, useState } from 'react'
import InvoicePage from '../components/InvoicePage'
import { Invoice } from '../data/types'

function App() {
  let data
  if (typeof window !== "undefined") {
    const savedInvoice = window.localStorage.getItem('invoiceData')
    data = null

    try {
      if (savedInvoice) {
        data = JSON.parse(savedInvoice)
      }
    } catch (_e) { }
  }

  const onInvoiceUpdated = (invoice: Invoice) => {
    window.localStorage.setItem('invoiceData', JSON.stringify(invoice))
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="app">
      <h1 className="center fs-30">React Invoice Generator</h1>
      <InvoicePage data={data} onChange={onInvoiceUpdated} />
    </div>
  )
}

export default App
