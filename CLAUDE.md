# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InvoiceFlow - A modern invoice automation SaaS platform built with React, TypeScript, and Vite. The application helps businesses automate invoicing, get paid 3x faster, and save 70% on processing costs.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Architecture Overview

### Component Organization

The codebase follows a modular, feature-based architecture:

- **`/src/components/common/`** - Reusable UI primitives (Button, Card, Input, Navigation) with variant support and TypeScript interfaces
- **`/src/components/landing/`** - Landing page components (Hero, Features, Pricing, EmailCapture, StatsGrid)
- **`/src/components/invoice/`** - Invoice-related components (not yet implemented)
- **`/src/components/dashboard/`** - Dashboard components (not yet implemented)

### Design System

Theme configuration is centralized in `/src/config/theme.ts` with:
- Color tokens (primary, secondary, backgrounds, text, states)
- Spacing scale (xs through xxl)
- Typography scale
- Border radius values
- Responsive breakpoints

All components use styled-components with the theme system for consistent styling.

### Component Patterns

Components follow these patterns:
- TypeScript interfaces for all props
- Variant-based styling (e.g., Button has primary/secondary/outline/ghost variants)
- Framer Motion for animations
- styled-components with theme integration
- Responsive design using theme breakpoints

Example component structure:
```typescript
interface ComponentProps {
  variant?: 'default' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  // ... other props
}

const StyledComponent = styled(motion.div)<{ $variant: string }>`
  ${props => variantStyles[props.$variant]}
`
```

## Tech Stack Details

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with React plugin
- **Styling**: styled-components with centralized theme
- **Animations**: Framer Motion
- **Forms**: react-hook-form
- **Icons**: lucide-react
- **Notifications**: react-toastify
- **Future Integrations**: Stripe (@stripe/stripe-js), PDF generation (jspdf)

## Current Implementation Status

### Completed
- Landing page with email capture
- Component library (Button, Card, Input, Navigation)
- Theme system and global styles
- TypeScript configuration
- Basic project structure

### Not Yet Implemented
- React Router configuration
- API services layer
- Invoice creation/management features
- Dashboard and analytics
- Authentication system
- Stripe payment integration
- State management solution

## Important Considerations

1. **Component Modularity**: When adding new features, create them in their respective feature folders (e.g., new invoice components go in `/src/components/invoice/`)

2. **Theme Usage**: Always use the theme system for colors, spacing, and typography instead of hardcoded values

3. **TypeScript**: Maintain strict typing - all new components should have proper TypeScript interfaces

4. **Styling Pattern**: Use styled-components with $ prefix for transient props to avoid DOM warnings

5. **Environment Variables**: Use VITE_ prefix for all environment variables (e.g., VITE_STRIPE_PUBLIC_KEY)

## Next Development Steps

The project is set up for the following features to be built:
1. Invoice creation and management system
2. Recurring billing functionality
3. Dashboard with revenue metrics
4. User authentication
5. Stripe payment integration
6. API service layer for backend communication