import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import * as Sentry from '@sentry/react'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'

vi.mock('@sentry/react')

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should track component render time', () => {
    const { rerender } = renderHook(() => 
      usePerformanceMonitor('TestComponent', { testProp: 'value' })
    )

    // Trigger a re-render
    rerender()

    expect(Sentry.withScope).toHaveBeenCalled()
  })

  it('should track slow renders', () => {
    // Mock performance.now to simulate slow render
    const originalNow = performance.now
    let callCount = 0
    performance.now = vi.fn(() => {
      callCount++
      return callCount === 1 ? 0 : 150 // 150ms render time
    })

    renderHook(() => usePerformanceMonitor('SlowComponent'))

    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining('Slow render detected'),
      'warning'
    )

    performance.now = originalNow
  })

  it('should measure custom actions', () => {
    const { result } = renderHook(() => 
      usePerformanceMonitor('TestComponent')
    )

    result.current.measureAction('testAction', () => {
      // Simulate some work
      const arr = new Array(1000).fill(0).map((_, i) => i * 2)
      return arr.reduce((a, b) => a + b, 0)
    })

    expect(Sentry.withScope).toHaveBeenCalled()
  })

  it('should track render count', () => {
    const { result, rerender } = renderHook(() => 
      usePerformanceMonitor('TestComponent')
    )

    expect(result.current.renderCount).toBe(1)

    rerender()
    expect(result.current.renderCount).toBe(2)

    rerender()
    expect(result.current.renderCount).toBe(3)
  })

  it('should log to console in development', () => {
    const originalEnv = import.meta.env.DEV
    Object.defineProperty(import.meta.env, 'DEV', {
      value: true,
      configurable: true
    })

    renderHook(() => usePerformanceMonitor('DevComponent'))

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[Performance] DevComponent rendered')
    )

    Object.defineProperty(import.meta.env, 'DEV', {
      value: originalEnv,
      configurable: true
    })
  })
})