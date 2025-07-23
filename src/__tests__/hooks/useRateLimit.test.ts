import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useRateLimit } from '../../hooks/useRateLimit'

describe('useRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should allow requests within the limit', () => {
    const { result } = renderHook(() => 
      useRateLimit({ maxRequests: 3, windowMs: 1000 })
    )

    expect(result.current.isLimited).toBe(false)
    
    act(() => {
      expect(result.current.checkLimit()).toBe(true)
      expect(result.current.checkLimit()).toBe(true)
      expect(result.current.checkLimit()).toBe(true)
    })

    expect(result.current.remainingRequests).toBe(0)
  })

  it('should block requests when limit is exceeded', () => {
    const { result } = renderHook(() => 
      useRateLimit({ maxRequests: 2, windowMs: 1000 })
    )

    act(() => {
      expect(result.current.checkLimit()).toBe(true)
      expect(result.current.checkLimit()).toBe(true)
      expect(result.current.checkLimit()).toBe(false)
    })

    expect(result.current.isLimited).toBe(true)
    expect(result.current.remainingRequests).toBe(0)
  })

  it('should reset limit after window expires', async () => {
    const { result } = renderHook(() => 
      useRateLimit({ maxRequests: 1, windowMs: 100 })
    )

    act(() => {
      expect(result.current.checkLimit()).toBe(true)
      expect(result.current.checkLimit()).toBe(false)
    })

    expect(result.current.isLimited).toBe(true)

    // Wait for window to expire
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
    })

    act(() => {
      expect(result.current.checkLimit()).toBe(true)
    })

    expect(result.current.isLimited).toBe(false)
  })

  it('should manually reset limit when resetLimit is called', () => {
    const { result } = renderHook(() => 
      useRateLimit({ maxRequests: 1, windowMs: 10000 })
    )

    act(() => {
      expect(result.current.checkLimit()).toBe(true)
      expect(result.current.checkLimit()).toBe(false)
    })

    expect(result.current.isLimited).toBe(true)

    act(() => {
      result.current.resetLimit()
    })

    expect(result.current.isLimited).toBe(false)
    expect(result.current.remainingRequests).toBe(1)
  })
})