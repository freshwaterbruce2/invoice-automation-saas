import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, DollarSign, FileText, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { theme } from '../../config/theme'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${theme.colors.text};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  
  &:hover {
    opacity: 0.8;
  }
`

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: ${theme.colors.error};
  color: white;
  border-radius: ${theme.borderRadius.full};
  padding: 2px 6px;
  font-size: ${theme.fontSize.xs};
  font-weight: bold;
`

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${theme.spacing.sm};
  width: 320px;
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
`

const Header = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: 600;
  color: ${theme.colors.text};
`

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const NotificationItem = styled.div<{ $unread?: boolean }>`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  background: ${props => props.$unread ? theme.colors.backgroundAlt : 'white'};
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${theme.colors.backgroundAlt};
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const NotificationContent = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`

const IconWrapper = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  ${props => {
    switch (props.$type) {
      case 'payment':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `
      case 'invoice':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `
      default:
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `
    }
  }}
`

const NotificationText = styled.div`
  flex: 1;
`

const NotificationTitle = styled.div`
  font-weight: 500;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`

const NotificationTime = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
`

const EmptyState = styled.div`
  padding: ${theme.spacing.xxl};
  text-align: center;
  color: ${theme.colors.textLight};
`

interface Notification {
  id: string
  type: 'payment' | 'invoice' | 'alert'
  title: string
  message: string
  created_at: string
  read: boolean
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    // Fetch notifications
    const fetchNotifications = async () => {
      // In production, this would fetch from a notifications table
      // For now, we'll simulate with invoice events
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'payment',
          title: 'Payment Received',
          message: 'Invoice #INV-2024-0001 has been paid',
          created_at: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'invoice',
          title: 'Invoice Sent',
          message: 'Invoice #INV-2024-0002 was sent to client',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
      ]
      
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    }

    fetchNotifications()

    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Create notification for new invoice
          const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            type: 'invoice',
            title: 'New Invoice Created',
            message: `Invoice #${payload.new.invoice_number} created`,
            created_at: new Date().toISOString(),
            read: false,
          }
          
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
    setIsOpen(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign size={20} />
      case 'invoice':
        return <FileText size={20} />
      default:
        return <AlertCircle size={20} />
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <NotificationButton onClick={() => setIsOpen(!isOpen)}>
        <Bell size={24} />
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      </NotificationButton>

      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Header>
              <Title>Notifications</Title>
              {notifications.length > 0 && (
                <ClearButton onClick={clearAll}>Clear all</ClearButton>
              )}
            </Header>

            <NotificationList>
              {notifications.length === 0 ? (
                <EmptyState>No new notifications</EmptyState>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    $unread={!notification.read}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <NotificationContent>
                      <IconWrapper $type={notification.type}>
                        {getIcon(notification.type)}
                      </IconWrapper>
                      <NotificationText>
                        <NotificationTitle>{notification.title}</NotificationTitle>
                        <NotificationTime>
                          {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                        </NotificationTime>
                      </NotificationText>
                    </NotificationContent>
                  </NotificationItem>
                ))
              )}
            </NotificationList>
          </Dropdown>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationCenter