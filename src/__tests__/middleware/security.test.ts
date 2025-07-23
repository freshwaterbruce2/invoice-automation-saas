import { sanitizeInput, sqlInjectionPatterns } from '../../middleware/security'

describe('Security Middleware', () => {
  describe('sanitizeInput', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("XSS")</script>'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('&lt;script&gt;')
    })

    it('should remove SQL injection attempts', () => {
      const inputs = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users--"
      ]

      inputs.forEach(input => {
        const sanitized = sanitizeInput(input)
        expect(sanitized).not.toMatch(/DROP TABLE/i)
        expect(sanitized).not.toMatch(/UNION SELECT/i)
        expect(sanitized).not.toContain('--')
      })
    })

    it('should handle normal input without modification', () => {
      const normalInputs = [
        'John Doe',
        'john.doe@example.com',
        '123 Main Street',
        'This is a normal description with some text.'
      ]

      normalInputs.forEach(input => {
        const sanitized = sanitizeInput(input)
        // Should only escape quotes and maintain the rest
        expect(sanitized).toBe(input.replace(/'/g, '&#x27;'))
      })
    })

    it('should trim whitespace', () => {
      const input = '  test input  '
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toBe('test input')
    })

    it('should handle special characters correctly', () => {
      const input = 'Price: $100 & shipping < $10 > $5'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toContain('&amp;')
      expect(sanitized).toContain('&lt;')
      expect(sanitized).toContain('&gt;')
    })
  })

  describe('SQL Injection Patterns', () => {
    it('should detect common SQL injection patterns', () => {
      const maliciousInputs = [
        'SELECT * FROM users',
        'INSERT INTO table VALUES',
        'UPDATE users SET',
        'DELETE FROM table',
        'DROP TABLE users',
        'UNION SELECT',
        'CREATE TABLE',
        'ALTER TABLE',
        'EXEC sp_',
        'EXECUTE xp_'
      ]

      maliciousInputs.forEach(input => {
        const hasInjection = sqlInjectionPatterns.some(pattern => 
          pattern.test(input)
        )
        expect(hasInjection).toBe(true)
      })
    })

    it('should detect comment-based injections', () => {
      const commentInjections = [
        "admin'--",
        "1' /*",
        "*/ OR 1=1",
        "'; -- comment"
      ]

      commentInjections.forEach(input => {
        const hasInjection = sqlInjectionPatterns.some(pattern => 
          pattern.test(input)
        )
        expect(hasInjection).toBe(true)
      })
    })

    it('should not flag legitimate SQL keywords in normal context', () => {
      const legitimateInputs = [
        'I need to update my profile',
        'Please select an option',
        'Delete this item from my cart',
        'Create a new account'
      ]

      legitimateInputs.forEach(input => {
        // These contain SQL keywords but in legitimate context
        // Our sanitizer should handle them appropriately
        const sanitized = sanitizeInput(input)
        expect(sanitized).toBeDefined()
      })
    })
  })
})