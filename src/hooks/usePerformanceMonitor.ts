import { useEffect, useRef } from 'react'
import * as Sentry from '@sentry/react'

export const usePerformanceMonitor = (componentName: string, props?: Record<string, any>) => {
  const renderStart = useRef<number>(performance.now())
  const renderCount = useRef<number>(0)

  useEffect(() => {
    const renderEnd = performance.now()
    const renderTime = renderEnd - renderStart.current
    renderCount.current += 1

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms (render #${renderCount.current})`)
    }

    // Send performance data to Sentry
    Sentry.withScope((scope) => {
      scope.setTag('component.name', componentName)
      scope.setContext('performance', {
        renderTime,
        renderCount: renderCount.current,
        componentName,
      })
      
      if (props) {
        scope.setContext('componentProps', props)
      }

      // Check for performance issues
      if (renderTime > 100) {
        Sentry.captureMessage(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`, 'warning')
      }
    })

    // Update render start time for next render
    renderStart.current = performance.now()
  })

  // Web Vitals monitoring
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      // Observe Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        Sentry.captureMessage('LCP Measurement', {
          level: 'info',
          extra: {
            value: lastEntry.startTime,
            component: componentName,
          },
        })
      })

      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      } catch (e) {
        // LCP is not available in this browser
      }

      // Observe First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const delay = entry.processingStart ? entry.processingStart - entry.startTime : entry.duration
          
          Sentry.captureMessage('FID Measurement', {
            level: 'info',
            extra: {
              value: delay,
              component: componentName,
            },
          })
        })
      })

      try {
        fidObserver.observe({ type: 'first-input', buffered: true })
      } catch (e) {
        // FID is not available in this browser
      }

      return () => {
        lcpObserver.disconnect()
        fidObserver.disconnect()
      }
    }
  }, [componentName])

  return {
    renderCount: renderCount.current,
    measureAction: (actionName: string, callback: () => void) => {
      const startTime = performance.now()
      
      callback()

      const endTime = performance.now()
      const duration = endTime - startTime

      // Send action performance data to Sentry
      Sentry.withScope((scope) => {
        scope.setTag('action.name', actionName)
        scope.setContext('actionPerformance', {
          actionName,
          duration,
          component: componentName,
        })
        
        if (duration > 500) {
          Sentry.captureMessage(`Slow action detected: ${actionName} took ${duration.toFixed(2)}ms`, 'warning')
        }
      })

      if (import.meta.env.DEV) {
        console.log(`[Performance] Action "${actionName}" took ${duration.toFixed(2)}ms`)
      }
    },
  }
}