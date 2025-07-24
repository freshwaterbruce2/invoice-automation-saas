# InvoiceFlow - Modern Invoice Automation SaaS

<p align="center">
  <img src="https://img.shields.io/badge/React-18.0-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.0-purple" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

A powerful invoice automation platform that helps businesses get paid 3x faster and save 70% on invoice processing costs. Built with React, TypeScript, and modern web technologies.

## Features

- **Invoice Management**: Create, edit, and manage invoices with a beautiful interface
- **Recurring Billing**: Set up automated recurring invoices with flexible scheduling
- **Payment Processing**: Accept payments via Stripe with saved card support
- **Real-time Updates**: Live notifications and updates powered by Supabase
- **Dashboard Analytics**: Revenue tracking and visual analytics
- **PDF Generation**: Export invoices as professional PDFs
- **Authentication**: Secure user authentication with Supabase Auth
- **Performance Monitoring**: Built-in performance tracking with Sentry

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: styled-components + Framer Motion
- **Build Tool**: Vite
- **State Management**: React Context API
- **Forms**: react-hook-form
- **Charts**: Recharts
- **PDF**: jsPDF + html2canvas
- **Payments**: Stripe
- **Backend**: Supabase (Auth + Database + Realtime)
- **Monitoring**: Sentry
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Sentry account (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/invoice-saas.git
cd invoice-saas
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENTRY_DSN=your_sentry_dsn
```

5. Start the development server:
```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

### Git Hooks

This project uses Husky for Git hooks:

- **pre-commit**: Runs TypeScript checks, linting, and tests
- **commit-msg**: Validates commit message format
- **post-commit**: Takes a session memory snapshot

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Card, etc.)
│   ├── invoice/        # Invoice-specific components
│   ├── dashboard/      # Dashboard components
│   └── landing/        # Landing page components
├── pages/              # Page components
├── services/           # Business logic and API services
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── types/              # TypeScript type definitions
├── config/             # Configuration files
└── utils/              # Utility functions
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy preview:
```bash
./deploy.sh
```

3. Deploy to production:
```bash
./deploy.sh production
```

### Environment Variables

Set these in your Vercel dashboard:

- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN`

## API Integration

### Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create tables:

```sql
-- Users table is automatically created by Supabase Auth

-- Clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  recurring_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice items table
CREATE TABLE invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can CRUD their own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD their own invoices" ON invoices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD their own invoice items" ON invoice_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );
```

### Stripe Integration

1. Create a Stripe account
2. Get your publishable key from the Stripe dashboard
3. Set up webhooks for payment events (when implementing backend)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@invoiceflow.com or join our Slack channel.