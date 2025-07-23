import React from 'react'
import { Clock,RefreshCw } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import Card from '../common/Card'

const Container = styled(Card)`
  margin-top: ${theme.spacing.xl};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`

const Title = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

const Toggle = styled.label`
  margin-left: auto;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
`

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${theme.colors.primary};
  }
  
  &:checked + span:before {
    transform: translateX(28px);
  }
`

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.border};
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`

const SettingsGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text};
`

const Select = styled.select`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.text};
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

const RadioGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.text};
`

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  accent-color: ${theme.colors.primary};
`


const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

const PreviewBox = styled.div`
  background: ${theme.colors.backgroundAlt};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

export interface RecurringConfig {
  enabled: boolean
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  interval: number
  startDate: string
  endDate?: string
  endType: 'never' | 'date' | 'occurrences'
  occurrences?: number
}

interface RecurringSettingsProps {
  config: RecurringConfig
  onChange: (config: RecurringConfig) => void
}

const RecurringSettings: React.FC<RecurringSettingsProps> = ({ 
  config, 
  onChange 
}) => {
  const handleToggle = (enabled: boolean) => {
    onChange({ ...config, enabled })
  }

  const getNextInvoiceDates = () => {
    if (!config.enabled || !config.startDate) {return []}
    
    const dates = []
    const start = new Date(config.startDate)
    const today = new Date()
    
    // Calculate next 3 invoice dates
    for (let i = 0; i < 3; i++) {
      const nextDate = new Date(start)
      
      switch (config.frequency) {
        case 'weekly':
          nextDate.setDate(start.getDate() + (i * 7 * config.interval))
          break
        case 'monthly':
          nextDate.setMonth(start.getMonth() + (i * config.interval))
          break
        case 'quarterly':
          nextDate.setMonth(start.getMonth() + (i * 3 * config.interval))
          break
        case 'yearly':
          nextDate.setFullYear(start.getFullYear() + (i * config.interval))
          break
      }
      
      if (nextDate >= today) {
        dates.push(nextDate.toLocaleDateString())
      }
    }
    
    return dates
  }

  const nextDates = getNextInvoiceDates()

  return (
    <Container>
      <Header>
        <Title>
          <RefreshCw size={20} />
          Recurring Invoice
        </Title>
        <Toggle>
          <ToggleInput
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          <ToggleSlider />
        </Toggle>
      </Header>

      {config.enabled && (
        <SettingsGrid>
          <FormGroup>
            <Label>Frequency</Label>
            <Select
              value={config.frequency}
              onChange={(e) => onChange({ 
                ...config, 
                frequency: e.target.value as RecurringConfig['frequency'] 
              })}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Repeat every</Label>
            <Select
              value={config.interval}
              onChange={(e) => onChange({ 
                ...config, 
                interval: parseInt(e.target.value) 
              })}
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <option key={i} value={i}>
                  {i} {config.frequency.replace('ly', '')}
                  {i > 1 ? 's' : ''}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={config.startDate}
              onChange={(e) => onChange({ 
                ...config, 
                startDate: e.target.value 
              })}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormGroup>

          <FormGroup>
            <Label>End Recurring</Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="endType"
                  value="never"
                  checked={config.endType === 'never'}
                  onChange={(e) => onChange({ 
                    ...config, 
                    endType: e.target.value as RecurringConfig['endType'] 
                  })}
                />
                Never
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="endType"
                  value="date"
                  checked={config.endType === 'date'}
                  onChange={(e) => onChange({ 
                    ...config, 
                    endType: e.target.value as RecurringConfig['endType'] 
                  })}
                />
                On Date
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="endType"
                  value="occurrences"
                  checked={config.endType === 'occurrences'}
                  onChange={(e) => onChange({ 
                    ...config, 
                    endType: e.target.value as RecurringConfig['endType'] 
                  })}
                />
                After
              </RadioLabel>
            </RadioGroup>
          </FormGroup>

          {config.endType === 'date' && (
            <FormGroup>
              <Label>End Date</Label>
              <Input
                type="date"
                value={config.endDate || ''}
                onChange={(e) => onChange({ 
                  ...config, 
                  endDate: e.target.value 
                })}
                min={config.startDate}
              />
            </FormGroup>
          )}

          {config.endType === 'occurrences' && (
            <FormGroup>
              <Label>Number of Invoices</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={config.occurrences || 1}
                onChange={(e) => onChange({ 
                  ...config, 
                  occurrences: parseInt(e.target.value) 
                })}
              />
            </FormGroup>
          )}

          {nextDates.length > 0 && (
            <PreviewBox>
              <Clock size={16} />
              Next invoices: {nextDates.join(', ')}
            </PreviewBox>
          )}
        </SettingsGrid>
      )}
    </Container>
  )
}

export default RecurringSettings