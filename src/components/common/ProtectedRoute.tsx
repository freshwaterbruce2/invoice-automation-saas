import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Loader } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { theme } from '../../config/theme'

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${theme.colors.backgroundAlt};
`

const Spinner = styled(Loader)`
  animation: spin 1s linear infinite;
  color: ${theme.colors.primary};
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner size={48} />
      </LoadingContainer>
    )
  }

  if (!user) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute