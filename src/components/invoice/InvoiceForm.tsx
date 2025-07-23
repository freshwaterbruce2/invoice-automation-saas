import React, { useState } from 'react'
import { useFieldArray,useForm } from 'react-hook-form'
import { Calendar, Mail, Phone,Plus, Trash2, User } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import { InvoiceFormData } from '../../types/invoice'
import Button from '../common/Button'
import Card from '../common/Card'
import Input from '../common/Input'

import RecurringSettings, { RecurringConfig } from './RecurringSettings'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`

const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
`

const ItemsTable = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  text-align: left;
  padding: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
  font-weight: 600;
  color: ${theme.colors.text};
`

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
`

const TableRow = styled.tr`
  &:hover {
    background: ${theme.colors.backgroundAlt};
  }
`

const AddButton = styled(Button)`
  align-self: flex-start;
`

const RemoveButton = styled(Button)`
  padding: ${theme.spacing.sm};
`

const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  align-items: flex-end;
  margin-top: ${theme.spacing.lg};
`

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 250px;
  padding: ${theme.spacing.sm} 0;
  
  &:last-child {
    border-top: 2px solid ${theme.colors.border};
    font-weight: bold;
    font-size: ${theme.fontSize.lg};
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.base};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData, recurring?: RecurringConfig) => void
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit }) => {
  const [recurringConfig, setRecurringConfig] = useState<RecurringConfig>({
    enabled: false,
    frequency: 'monthly',
    interval: 1,
    startDate: new Date().toISOString().split('T')[0],
    endType: 'never',
  })
  
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<InvoiceFormData>({
    defaultValues: {
      items: [{ description: '', quantity: 1, price: 0 }],
      tax: 0,
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchItems = watch('items')
  const watchTax = watch('tax') || 0

  const calculateSubtotal = () => {
    return watchItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.price) || 0
      return sum + (quantity * price)
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const taxAmount = (subtotal * watchTax) / 100
  const total = subtotal + taxAmount

  const handleFormSubmit = (data: InvoiceFormData) => {
    const enrichedData = {
      ...data,
      items: data.items.map(item => ({
        ...item,
        total: (Number(item.quantity) || 0) * (Number(item.price) || 0)
      }))
    }
    onSubmit(enrichedData, recurringConfig.enabled ? recurringConfig : undefined)
  }

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Section>
        <SectionTitle>Client Information</SectionTitle>
        <Grid>
          <Input
            label="Client Name"
            icon={<User size={20} />}
            {...register('client.name', { required: 'Client name is required' })}
            error={errors.client?.name?.message}
          />
          <Input
            label="Email"
            type="email"
            icon={<Mail size={20} />}
            {...register('client.email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.client?.email?.message}
          />
          <Input
            label="Phone"
            type="tel"
            icon={<Phone size={20} />}
            {...register('client.phone')}
          />
          <Input
            label="Company"
            {...register('client.company')}
          />
        </Grid>
        <Input
          label="Address"
          {...register('client.address')}
        />
      </Section>

      <Section>
        <SectionTitle>Invoice Details</SectionTitle>
        <Grid>
          <Input
            label="Issue Date"
            type="date"
            icon={<Calendar size={20} />}
            {...register('issueDate', { required: 'Issue date is required' })}
            error={errors.issueDate?.message}
          />
          <Input
            label="Due Date"
            type="date"
            icon={<Calendar size={20} />}
            {...register('dueDate', { required: 'Due date is required' })}
            error={errors.dueDate?.message}
          />
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Invoice Items</SectionTitle>
        <ItemsTable>
          <Table>
            <thead>
              <tr>
                <TableHeader>Description</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Total</TableHeader>
                <TableHeader style={{ width: '50px' }}></TableHeader>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                const quantity = Number(watchItems[index]?.quantity) || 0
                const price = Number(watchItems[index]?.price) || 0
                const itemTotal = quantity * price

                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input
                        placeholder="Item description"
                        {...register(`items.${index}.description`, { 
                          required: 'Description is required' 
                        })}
                        error={errors.items?.[index]?.description?.message}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="1"
                        min="1"
                        {...register(`items.${index}.quantity`, { 
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Minimum quantity is 1' }
                        })}
                        error={errors.items?.[index]?.quantity?.message}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        {...register(`items.${index}.price`, { 
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be positive' }
                        })}
                        error={errors.items?.[index]?.price?.message}
                      />
                    </TableCell>
                    <TableCell>
                      ${itemTotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {fields.length > 1 && (
                        <RemoveButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={16} />
                        </RemoveButton>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </tbody>
          </Table>
        </ItemsTable>
        
        <AddButton
          type="button"
          variant="outline"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => append({ description: '', quantity: 1, price: 0 })}
        >
          Add Item
        </AddButton>

        <TotalSection>
          <TotalRow>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </TotalRow>
          <TotalRow>
            <span>Tax (%):</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              style={{ width: '100px' }}
              {...register('tax')}
            />
          </TotalRow>
          <TotalRow>
            <span>Tax Amount:</span>
            <span>${taxAmount.toFixed(2)}</span>
          </TotalRow>
          <TotalRow>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </TotalRow>
        </TotalSection>
      </Section>

      <Section>
        <SectionTitle>Additional Information</SectionTitle>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: theme.spacing.sm,
            fontWeight: 500,
            color: theme.colors.text 
          }}>
            Notes
          </label>
          <TextArea
            placeholder="Add any notes for the client..."
            {...register('notes')}
          />
        </div>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: theme.spacing.sm,
            fontWeight: 500,
            color: theme.colors.text 
          }}>
            Terms & Conditions
          </label>
          <TextArea
            placeholder="Payment terms, late fees, etc..."
            {...register('terms')}
          />
        </div>
      </Section>

      <RecurringSettings
        config={recurringConfig}
        onChange={setRecurringConfig}
      />

      <Button type="submit" size="lg">
        {recurringConfig.enabled ? 'Create Recurring Invoice' : 'Create Invoice'}
      </Button>
    </Form>
  )
}

export default InvoiceForm