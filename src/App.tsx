import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'
import CreateInvoice from './pages/CreateInvoice'
import Dashboard from './pages/Dashboard'
import InvoicePayment from './pages/InvoicePayment'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'

import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/invoice/new" element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          } />
          <Route path="/invoice/:invoiceId/payment" element={<InvoicePayment />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App