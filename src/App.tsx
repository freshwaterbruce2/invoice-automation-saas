import React from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import CreateInvoice from './pages/CreateInvoice'
import Dashboard from './pages/Dashboard'
import InvoicePayment from './pages/InvoicePayment'
import Landing from './pages/Landing'

import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice/new" element={<CreateInvoice />} />
        <Route path="/invoice/:invoiceId/payment" element={<InvoicePayment />} />
      </Routes>
    </Router>
  )
}

export default App