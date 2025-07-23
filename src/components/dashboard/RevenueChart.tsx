import React from 'react'
import { 
  Area,
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis} from 'recharts'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import Card from '../common/Card'

const ChartCard = styled(Card)`
  height: 400px;
`

const ChartTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
`

const ChartContainer = styled.div`
  height: 320px;
  margin: 0 -${theme.spacing.md};
`

interface DataPoint {
  month: string
  revenue: number
  invoices: number
}

interface RevenueChartProps {
  data?: DataPoint[]
}

// Mock data for demo
const defaultData: DataPoint[] = [
  { month: 'Jan', revenue: 12500, invoices: 24 },
  { month: 'Feb', revenue: 15200, invoices: 32 },
  { month: 'Mar', revenue: 18900, invoices: 41 },
  { month: 'Apr', revenue: 22100, invoices: 48 },
  { month: 'May', revenue: 26800, invoices: 56 },
  { month: 'Jun', revenue: 31500, invoices: 63 },
]

const RevenueChart: React.FC<RevenueChartProps> = ({ data = defaultData }) => {
  const formatYAxis = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`
  }

  const formatTooltip = (value: number, name: string) => {
    if (name === 'revenue') {
      return [`$${value.toLocaleString()}`, 'Revenue']
    }
    return [value, 'Invoices']
  }

  return (
    <ChartCard>
      <ChartTitle>Revenue Overview</ChartTitle>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis 
              dataKey="month" 
              stroke={theme.colors.textLight}
              style={{ fontSize: theme.fontSize.sm }}
            />
            <YAxis 
              stroke={theme.colors.textLight}
              tickFormatter={formatYAxis}
              style={{ fontSize: theme.fontSize.sm }}
            />
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={theme.colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartCard>
  )
}

export default RevenueChart