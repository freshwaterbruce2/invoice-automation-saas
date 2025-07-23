import { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
}

interface RateLimitState {
  count: number
  resetTime: number
}

export const useRateLimit = (config: RateLimitConfig) => {
  const { maxRequests, windowMs, message = 'Too many requests. Please try again later.' } = config
  const [isLimited, setIsLimited] = useState(false)
  const state = useRef<RateLimitState>({
    count: 0,
    resetTime: Date.now() + windowMs
  })

  const checkLimit = useCallback(() => {
    const now = Date.now()
    
    // Reset window if needed
    if (now > state.current.resetTime) {
      state.current = {
        count: 0,
        resetTime: now + windowMs
      }
      setIsLimited(false)
    }

    // Check if limit exceeded
    if (state.current.count >= maxRequests) {
      const timeLeft = Math.ceil((state.current.resetTime - now) / 1000)
      toast.error(`${message} Try again in ${timeLeft} seconds.`)
      setIsLimited(true)
      return false
    }

    // Increment counter
    state.current.count++
    return true
  }, [maxRequests, windowMs, message])

  const resetLimit = useCallback(() => {
    state.current = {
      count: 0,
      resetTime: Date.now() + windowMs
    }
    setIsLimited(false)
  }, [windowMs])

  const getRemainingRequests = useCallback(() => {
    const now = Date.now()
    if (now > state.current.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - state.current.count)
  }, [maxRequests])

  const getResetTime = useCallback(() => {
    return new Date(state.current.resetTime)
  }, [])

  return {
    checkLimit,
    resetLimit,
    isLimited,
    remainingRequests: getRemainingRequests(),
    resetTime: getResetTime()
  }
}

// Common rate limit configurations
export const RATE_LIMITS = {
  API_CALLS: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  INVOICE_CREATION: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 invoices per minute
  EMAIL_SENDING: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 emails per minute
  AUTH_ATTEMPTS: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  FILE_UPLOADS: { maxRequests: 20, windowMs: 60 * 60 * 1000 }, // 20 files per hour
}