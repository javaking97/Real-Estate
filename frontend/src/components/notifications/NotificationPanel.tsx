import React from 'react';
import { AppIcons } from '@/components/icons/AppIcons';
import { realEstateMockData, type NotificationItem, type NotificationType } from '@/lib/mock-data';
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence';

type NotificationFilter = '전체' | '긴급' | '일정' | 'AI';

type NotificationPanelProps = {
  open: boolean;
  onClose: () => void;
};

const notificationTypeLabelMap: Record<NotificationType, Exclude<NotificationFilter, '전체'>> = {
  urgent: '긴급',
  expire: '긴급',
  schedule: '일정',
  contract: '일정',
  ai: 'AI',
};

const notificationColorMap: Record<NotificationType, string> = {
  urgent: '#EF4444',
  expire: '#EF4444',
  schedule: '#F59E0B',
  contract: '#F59E0B',
  ai: '#2563EB',
};

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [filter, setFilter] = React.useState<NotificationFilter>('전체');
  const panelPresence = useAnimatedPresence(open);

  if (!panelPresence.present) {
    return null;
  }

  const allNotifications = realEstateMockData.notifications;
  const unreadCount = allNotifications.filter((notification) => !notification.read).length;
  const filters: NotificationFilter[] = ['전체', '긴급', '일정', 'AI'];
  const filteredNotifications =
    filter === '전체'
      ? allNotifications
      : allNotifications.filter(
          (notification) => notificationTypeLabelMap[notification.type] === filter,
        );

  return (
    <>
      <button
        aria-label="알림 패널 닫기"
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.15)', border: 'none' }}
      />

      <section
        className="notification-panel popover-scale"
        data-placement="bottom"
        data-transition-status={panelPresence.transitionStatus}
        style={{
          position: 'fixed',
          top: 62,
          right: 292,
          width: 360,
          zIndex: 201,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #D5DBDB',
          boxShadow: '0 2px 4px #00000021',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>알림</span>
            {unreadCount > 0 && (
              <span style={{ background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 99, padding: '1px 6px' }}>
                {unreadCount}
              </span>
            )}
          </div>
          <button type="button" style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
            모두 읽음
          </button>
        </div>

        <div style={{ padding: '10px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 6 }}>
          {filters.map((filterItem) => (
            <button
              key={filterItem}
              type="button"
              onClick={() => setFilter(filterItem)}
              style={{
                padding: '4px 10px',
                borderRadius: 99,
                border: `1px solid ${filter === filterItem ? '#2563EB' : '#E5E7EB'}`,
                background: filter === filterItem ? '#EFF6FF' : 'transparent',
                color: filter === filterItem ? '#2563EB' : '#6B7280',
                fontSize: 11,
                fontWeight: filter === filterItem ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {filterItem}
            </button>
          ))}
        </div>

        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          {filteredNotifications.map((notification, index) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              divider={index < filteredNotifications.length - 1}
            />
          ))}
        </div>

        <div style={{ padding: '10px 16px', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
          <button type="button" style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            전체 알림 보기 →
          </button>
        </div>
      </section>
    </>
  );
}

function NotificationRow({ notification, divider }: { notification: NotificationItem; divider: boolean }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        border: 'none',
        display: 'flex',
        gap: 12,
        padding: '12px 16px',
        borderBottom: divider ? '1px solid #F9FAFB' : 'none',
        background: hovered ? '#F3F4F6' : notification.read ? '#fff' : '#F8FBFF',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 1, marginTop: 2, color: notificationColorMap[notification.type] }}>
        {resolveNotificationIcon(notification.icon)}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: notification.read ? 500 : 700, color: '#111827' }}>{notification.title}</span>
          {!notification.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', display: 'inline-block', flexShrink: 0 }} />}
        </span>
        <span style={{ fontSize: 11, color: '#6B7280', marginTop: 3, lineHeight: 1.5, display: 'block' }}>{notification.desc}</span>
        <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3, display: 'block' }}>{notification.time}</span>
      </span>
    </button>
  );
}

function resolveNotificationIcon(icon: NotificationItem['icon']) {
  if (icon === 'calendar') return AppIcons.calendar;
  if (icon === 'sparkle') return AppIcons.sparkle;
  if (icon === 'zap') return AppIcons.zap;
  if (icon === 'template') return AppIcons.template;
  return AppIcons.bell;
}
