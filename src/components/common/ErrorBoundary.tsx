import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, Home,RefreshCw } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import { logErrorToSentry } from '../../services/sentry'

import Button from './Button'
import Card from './Card'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.backgroundAlt};
  padding: ${theme.spacing.xl};
`

const ErrorCard = styled(Card)`
  max-width: 500px;
  text-align: center;
`

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing.xl};
`

const Title = styled.h1`
  font-size: ${theme.fontSize['2xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`

const Message = styled.p`
  color: ${theme.colors.textLight};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
`

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
`

const ErrorDetails = styled.details`
  margin-top: ${theme.spacing.xl};
  text-align: left;
  
  summary {
    cursor: pointer;
    color: ${theme.colors.textLight};
    font-size: ${theme.fontSize.sm};
    margin-bottom: ${theme.spacing.md};
  }
  
  pre {
    background: ${theme.colors.backgroundAlt};
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    overflow-x: auto;
    font-size: ${theme.fontSize.sm};
    line-height: 1.4;
  }
`

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry
    logErrorToSentry(error, { componentStack: errorInfo.componentStack || '' })
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      return (
        <Container>
          <ErrorCard>
            <IconWrapper>
              <AlertTriangle size={64} color={theme.colors.warning} />
            </IconWrapper>
            
            <Title>Oops! Something went wrong</Title>
            
            <Message>
              We&apos;re sorry for the inconvenience. An unexpected error occurred.
              Our team has been notified and is working on a fix.
            </Message>
            
            <Actions>
              <Button
                variant="outline"
                icon={<Home size={20} />}
                onClick={this.handleGoHome}
              >
                Go to Homepage
              </Button>
              <Button
                icon={<RefreshCw size={20} />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </Actions>
            
            {import.meta.env.DEV && this.state.error && (
              <ErrorDetails>
                <summary>Error Details (Development Only)</summary>
                <pre>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </ErrorDetails>
            )}
          </ErrorCard>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary