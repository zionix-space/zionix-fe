import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dropdown,
  List,
  Avatar,
  Typography,
  Button,
  Badge,
  Space,
  Divider,
  Tag,
  Empty,
  Spin,
} from 'antd';
import { useTheme } from '@zionix/design-system';

const { Text, Title } = Typography;

// Comprehensive SaaS notification dummy data
const generateNotificationData = () => [
  {
    id: 1,
    type: 'success',
    category: 'system',
    title: 'System Update Complete',
    message: 'Your Zionix platform has been successfully updated to version 2.4.1. New features include enhanced security, improved performance, and advanced analytics dashboard.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    read: false,
    priority: 'high',
    avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=system&icon=gear',
    actions: [
      { label: 'View Release Notes', type: 'primary', action: 'view_release' },
      { label: 'Dismiss', type: 'text', action: 'dismiss' }
    ],
    metadata: { version: '2.4.1', updateType: 'major' }
  },
  {
    id: 2,
    type: 'info',
    category: 'user_activity',
    title: 'New Team Member Added',
    message: 'Sarah Johnson (sarah.johnson@acmecorp.com) has been added to the Marketing Team and requires role assignment and onboarding.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    priority: 'medium',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4',
    actions: [
      { label: 'Assign Role', type: 'primary', action: 'assign_role' },
      { label: 'View Profile', type: 'text', action: 'view_profile' }
    ],
    metadata: { userId: 'usr_12345', team: 'Marketing', department: 'Sales & Marketing' }
  },
  {
    id: 3,
    type: 'warning',
    category: 'security',
    title: 'Security Alert: Unusual Login Activity',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100 (Location: San Francisco, CA). Consider reviewing security settings and enabling 2FA.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    read: false,
    priority: 'high',
    avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=security&icon=shield',
    actions: [
      { label: 'Block IP', type: 'primary', action: 'block_ip' },
      { label: 'View Security Logs', type: 'text', action: 'view_logs' }
    ],
    metadata: { ip: '192.168.1.100', attempts: 5, location: 'San Francisco, CA' }
  },
  {
    id: 4,
    type: 'info',
    category: 'billing',
    title: 'Subscription Renewal Reminder',
    message: 'Your Enterprise Pro subscription ($299/month) will automatically renew in 3 days. Current usage: 85% of API calls, 92% of storage.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    priority: 'medium',
    avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=billing&icon=creditCard',
    actions: [
      { label: 'Manage Billing', type: 'primary', action: 'manage_billing' },
      { label: 'Upgrade Plan', type: 'text', action: 'upgrade_plan' }
    ],
    metadata: { plan: 'Enterprise Pro', amount: 299, currency: 'USD', renewalDate: '2024-01-15' }
  },
  {
    id: 5,
    type: 'error',
    category: 'system',
    title: 'API Rate Limit Exceeded',
    message: 'Your application has exceeded the API rate limit (1000 requests/hour). Some features may be temporarily unavailable until the limit resets.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
    priority: 'high',
    avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=api&icon=warning',
    actions: [
      { label: 'Upgrade Limits', type: 'primary', action: 'upgrade_limits' },
      { label: 'View Usage', type: 'text', action: 'view_usage' }
    ],
    metadata: { currentUsage: 1000, limit: 1000, resetTime: '2024-01-12T15:00:00Z' }
  },
  {
    id: 6,
    type: 'success',
    category: 'feature',
    title: 'New Feature: Advanced Analytics',
    message: 'Introducing our new Advanced Analytics dashboard with real-time insights, custom reports, and predictive analytics. Available now in your workspace.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    priority: 'low',
    avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=analytics&icon=chart',
    actions: [
      { label: 'Explore Feature', type: 'primary', action: 'explore_feature' },
      { label: 'Watch Demo', type: 'text', action: 'watch_demo' }
    ],
    metadata: { featureId: 'advanced_analytics', category: 'analytics' }
  },
  {
    id: 7,
    type: 'info',
    category: 'approval',
    title: 'Pending Approval: Client Onboarding',
    message: 'TechCorp Inc. client onboarding request is pending your approval. Review includes contract terms, pricing tier, and access permissions.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: false,
    priority: 'medium',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techcorp&backgroundColor=ffd93d',
    actions: [
      { label: 'Review & Approve', type: 'primary', action: 'review_approve' },
      { label: 'View Details', type: 'text', action: 'view_details' }
    ],
    metadata: { clientId: 'client_789', companyName: 'TechCorp Inc.', tier: 'Enterprise' }
  },
  {
    id: 8,
    type: 'warning',
    category: 'maintenance',
    title: 'Scheduled Maintenance Notice',
    message: 'Planned system maintenance on January 15th, 2024 from 2:00 AM - 4:00 AM EST. Services may be temporarily unavailable during this window.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: 'medium',
    avatar: 'https://api.dicebear.com/7.x/icons/svg?seed=maintenance&icon=tools',
    actions: [
      { label: 'Add to Calendar', type: 'primary', action: 'add_calendar' },
      { label: 'Learn More', type: 'text', action: 'learn_more' }
    ],
    metadata: { startTime: '2024-01-15T07:00:00Z', endTime: '2024-01-15T09:00:00Z', timezone: 'EST' }
  }
];

// Utility functions
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return timestamp.toLocaleDateString();
};

const getNotificationTypeConfig = (type, token) => {
  const configs = {
    success: {
      color: token.colorSuccess,
      icon: 'ri-check-circle-line',
      bgColor: token.colorSuccessBg,
      borderColor: token.colorSuccessBorder
    },
    warning: {
      color: token.colorWarning,
      icon: 'ri-alert-line',
      bgColor: token.colorWarningBg,
      borderColor: token.colorWarningBorder
    },
    error: {
      color: token.colorError,
      icon: 'ri-error-warning-line',
      bgColor: token.colorErrorBg,
      borderColor: token.colorErrorBorder
    },
    info: {
      color: token.colorInfo,
      icon: 'ri-information-line',
      bgColor: token.colorInfoBg,
      borderColor: token.colorInfoBorder
    }
  };
  return configs[type] || configs.info;
};

const getPriorityColor = (priority, token) => {
  const colors = {
    high: token.colorError,
    medium: token.colorWarning,
    low: token.colorSuccess
  };
  return colors[priority] || colors.medium;
};

// Animation variants
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

export const NotificationDropdown = ({ 
  trigger, 
  placement = 'bottomRight',
  isMobile = false,
  onNotificationClick,
  className,
  buttonStyle 
}) => {
  const { token } = useTheme();
  const [notifications, setNotifications] = useState(generateNotificationData());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handlers
  const handleNotificationAction = (notificationId, actionType) => {
    console.log(`Action "${actionType}" clicked for notification ${notificationId}`);
    
    if (actionType === 'dismiss') {
      markAsRead(notificationId);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notificationId, actionType);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNotifications(generateNotificationData());
    setLoading(false);
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  // Styles
  const dropdownStyles = {
    width: isMobile ? '100vw' : 420,
    maxHeight: isMobile ? '80vh' : 600,
    backgroundColor: token.colorBgElevated,
    borderRadius: isMobile ? '16px 16px 0 0' : token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    border: `1px solid ${token.colorBorderSecondary}`,
    overflow: 'hidden'
  };

  const headerStyles = {
    padding: '20px 24px 16px',
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    background: `linear-gradient(135deg, ${token.colorBgElevated} 0%, ${token.colorFillQuaternary} 100%)`,
    position: 'sticky',
    top: 0,
    zIndex: 10
  };

  const contentStyles = {
    maxHeight: isMobile ? 'calc(80vh - 140px)' : 480,
    overflowY: 'auto',
    overflowX: 'hidden'
  };

  const footerStyles = {
    padding: '16px 24px',
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorBgElevated,
    position: 'sticky',
    bottom: 0,
    zIndex: 10
  };

  // Notification dropdown content
  const notificationContent = (
    <motion.div
      style={dropdownStyles}
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Header */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={4} style={{ margin: 0, color: token.colorText, fontWeight: 600 }}>
            Notifications
          </Title>
          <Space>
            <Button
              type="text"
              size="small"
              icon={<i className="ri-refresh-line" />}
              onClick={handleRefresh}
              loading={loading}
              style={{ color: token.colorTextSecondary }}
            />
            {isMobile && (
              <Button
                type="text"
                size="small"
                icon={<i className="ri-close-line" />}
                onClick={() => setOpen(false)}
                style={{ color: token.colorTextSecondary }}
              />
            )}
          </Space>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Badge 
              count={unreadCount} 
              size="small" 
              style={{ backgroundColor: token.colorPrimary }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {unreadCount} unread
            </Text>
          </Space>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={markAllAsRead}
              style={{ padding: 0, height: 'auto', fontSize: 12, fontWeight: 500 }}
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={contentStyles}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 40 }}>
            <Empty 
              description="No notifications"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
            <div key={date}>
              <div style={{ 
                padding: '12px 24px 8px', 
                backgroundColor: token.colorFillAlter,
                borderBottom: `1px solid ${token.colorBorderSecondary}`
              }}>
                <Text strong style={{ fontSize: 12, color: token.colorTextSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {new Date(date).toDateString() === new Date().toDateString() ? 'Today' : 
                   new Date(date).toDateString() === new Date(Date.now() - 24*60*60*1000).toDateString() ? 'Yesterday' :
                   new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </Text>
              </div>
              
              <List
                dataSource={dateNotifications}
                renderItem={(notification, index) => {
                  const typeConfig = getNotificationTypeConfig(notification.type, token);
                  
                  return (
                    <motion.div
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      custom={index}
                    >
                      <List.Item
                        style={{
                          padding: '16px 24px',
                          borderBottom: `1px solid ${token.colorBorderSecondary}`,
                          backgroundColor: notification.read ? 'transparent' : token.colorPrimaryBg,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        {/* Priority indicator */}
                        {notification.priority === 'high' && (
                          <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            backgroundColor: getPriorityColor(notification.priority, token)
                          }} />
                        )}

                        <List.Item.Meta
                          avatar={
                            <div style={{ position: 'relative' }}>
                              <Avatar 
                                src={notification.avatar}
                                size={44}
                                style={{ 
                                  border: `2px solid ${typeConfig.borderColor}`,
                                  backgroundColor: typeConfig.bgColor
                                }}
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                backgroundColor: typeConfig.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `2px solid ${token.colorBgElevated}`,
                                boxShadow: token.boxShadowTertiary
                              }}>
                                <i 
                                  className={typeConfig.icon}
                                  style={{ 
                                    fontSize: 10, 
                                    color: 'white',
                                    lineHeight: 1
                                  }}
                                />
                              </div>
                            </div>
                          }
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                              <div style={{ flex: 1, marginRight: 12 }}>
                                <Text strong style={{ 
                                  color: token.colorText,
                                  fontSize: 14,
                                  lineHeight: '20px',
                                  display: 'block'
                                }}>
                                  {notification.title}
                                </Text>
                                <Space size={4} style={{ marginTop: 2 }}>
                                  <Tag 
                                    color={typeConfig.color} 
                                    style={{ 
                                      fontSize: 10, 
                                      padding: '0 6px',
                                      lineHeight: '16px',
                                      border: 'none',
                                      textTransform: 'capitalize'
                                    }}
                                  >
                                    {notification.category.replace('_', ' ')}
                                  </Tag>
                                  {notification.priority === 'high' && (
                                    <Tag color="red" style={{ fontSize: 10, padding: '0 6px', lineHeight: '16px', border: 'none' }}>
                                      High Priority
                                    </Tag>
                                  )}
                                </Space>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                {!notification.read && (
                                  <div style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: token.colorPrimary,
                                    boxShadow: `0 0 0 2px ${token.colorPrimaryBg}`
                                  }} />
                                )}
                                <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                                  {formatTimestamp(notification.timestamp)}
                                </Text>
                              </div>
                            </div>
                          }
                          description={
                            <div style={{ marginTop: 6 }}>
                              <Text 
                                type="secondary" 
                                style={{ 
                                  fontSize: 13,
                                  lineHeight: '18px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  marginBottom: 8
                                }}
                              >
                                {notification.message}
                              </Text>
                              
                              {notification.actions && (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                  {notification.actions.map((action, actionIndex) => (
                                    <Button
                                      key={actionIndex}
                                      type={action.type}
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNotificationAction(notification.id, action.action);
                                      }}
                                      style={{ 
                                        fontSize: 11,
                                        height: 26,
                                        padding: '0 12px',
                                        borderRadius: token.borderRadiusSM
                                      }}
                                    >
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          }
                        />
                      </List.Item>
                    </motion.div>
                  );
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={footerStyles}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            type="link" 
            size="small"
            style={{ fontSize: 13, padding: 0, fontWeight: 500 }}
            onClick={() => {
              setOpen(false);
              console.log('View all notifications clicked');
            }}
          >
            View All Notifications
          </Button>
          <Button 
            type="text" 
            size="small"
            icon={<i className="ri-settings-3-line" />}
            style={{ fontSize: 13, color: token.colorTextSecondary }}
            onClick={() => {
              setOpen(false);
              console.log('Notification settings clicked');
            }}
          >
            Settings
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Create default trigger if none provided
  const defaultTrigger = (
    <Button
      type="text"
      icon={<i className="ri-notification-line" />}
      style={{
        ...buttonStyle,
        color: open ? token.colorPrimary : buttonStyle?.color,
        backgroundColor: open ? token.colorPrimaryBg : buttonStyle?.backgroundColor,
      }}
    />
  );

  // Use provided trigger or default trigger
  const triggerElement = trigger || defaultTrigger;

  return (
    <Dropdown
      overlay={notificationContent}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement={placement}
      arrow={{ pointAtCenter: true }}
      className={className}
      overlayStyle={{
        padding: 0,
        ...(isMobile && {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 'auto',
          transform: 'none'
        })
      }}
    >
      <Badge count={unreadCount} size="small" overflowCount={99}>
        {trigger && React.isValidElement(trigger) ? (
          React.cloneElement(trigger, {
            style: {
              ...(trigger.props?.style || {}),
              color: open ? token.colorPrimary : (trigger.props?.style?.color || undefined),
              backgroundColor: open ? token.colorPrimaryBg : (trigger.props?.style?.backgroundColor || undefined),
            }
          })
        ) : (
          triggerElement
        )}
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;