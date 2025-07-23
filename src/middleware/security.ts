// Security middleware configuration for production
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.mxpnl.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.sentry.io wss://*.supabase.co https://www.google-analytics.com https://api.mixpanel.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
}

// Rate limiting configuration
export const rateLimits = {
  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    skipSuccessfulRequests: true,
    message: 'Too many authentication attempts, please try again later.',
  },
  
  // Invoice creation
  createInvoice: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit to 10 invoices per minute
    keyGenerator: (req: any) => req.user?.id || req.ip, // Rate limit by user ID
    message: 'Invoice creation rate limit exceeded.',
  },
  
  // File uploads
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Upload rate limit exceeded.',
  }
}

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://invoiceflow.com',
      'https://www.invoiceflow.com',
      'https://app.invoiceflow.com',
      process.env.VITE_APP_URL
    ].filter(Boolean)
    
    // Allow requests with no origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
}

// Input validation schemas
export const validationSchemas = {
  invoice: {
    client: {
      name: { required: true, minLength: 2, maxLength: 100 },
      email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
      phone: { maxLength: 20 },
      address: { maxLength: 200 }
    },
    items: {
      minItems: 1,
      maxItems: 50,
      item: {
        description: { required: true, maxLength: 500 },
        quantity: { required: true, min: 0.01, max: 10000 },
        price: { required: true, min: 0, max: 1000000 }
      }
    },
    notes: { maxLength: 1000 },
    dueDate: { required: true, futureDate: true }
  },
  
  auth: {
    email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
    password: { required: true, minLength: 8, maxLength: 128 },
    fullName: { minLength: 2, maxLength: 100 }
  }
}

// SQL injection prevention patterns
export const sqlInjectionPatterns = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
  /(--|\/\*|\*\/|xp_|sp_|<script|<\/script|javascript:|onerror=|onload=)/gi
]

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  // Remove any potential SQL injection attempts
  let sanitized = input
  sqlInjectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })
  
  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
  
  return sanitized.trim()
}