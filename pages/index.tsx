import React, { useEffect, useState } from 'react'
import InvoicePage from '../components/InvoicePage'
import { Invoice } from '../data/types'

function App() {
  const [data, setDate] = useState()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedInvoice = window.localStorage.getItem('invoiceData')
    setDate(null)

    try {
      if (savedInvoice) {
        setDate(JSON.parse(savedInvoice))
      }
    } catch (_e) { }

    setMounted(true)
  }, [])

  if (!mounted) return null

  const onInvoiceUpdated = (invoice: Invoice) => {
    window.localStorage.setItem('invoiceData', JSON.stringify(invoice))
  }

  return (
    <div className="app">
      <InvoicePage data={data} onChange={onInvoiceUpdated} />
    </div>
  )
}

export default App
