import React from 'react';
import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useUiStore } from '@/app/store/ui';
import { AppIcons } from '@/components/icons/AppIcons';
import { showToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { realEstateMockData, type NotificationItem, type NotificationType } from '@/lib/mock-data';

type HeaderProps = {
  onSearch?: (value: string) => void;
  onMenuToggle?: () => void;
};

type FloatingPanelPosition = {
  floatingRef: (node: HTMLElement | null) => void;
  floatingStyles: React.CSSProperties;
};

type NotificationFilter = '전체' | '긴급' | '일정' | 'AI';

const pageLabelMap: Record<string, string> = {
  dashboard: '샘플부동산 비서',
  today: '오늘 할 일',
  customers: '고객관리',
  properties: '매물관리',
  consultations: '상담관리',
  schedule: '일정관리',
  templates: '템플릿관리',
  analytics: '분석 리포트',
  tools: '업무 도구',
  settings: '설정',
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

const popoverTransition = {
  duration: 0.12,
  ease: [0.2, 0.6, 0.4, 1] as const,
};

const popoverExitTransition = {
  duration: 0.08,
  ease: [0.4, 0, 0.6, 0.2] as const,
};

const popoverInitial = { opacity: 0, scale: 0.72 };
const popoverAnimate = { opacity: 1, scale: 1 };
const popoverExit = { opacity: 0, scale: 0.88, transition: popoverExitTransition };
const headerPopoverOffset = 14;

export function Header({ onSearch, onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const [search, setSearch] = React.useState('');
  const [showAutocomplete, setShowAutocomplete] = React.useState(false);
  const [now, setNow] = React.useState(new Date());
  const [menuOpen, setMenuOpen] = React.useState(false);
  const notificationOpen = useUiStore((state) => state.notificationOpen);
  const toggleNotification = useUiStore((state) => state.toggleNotification);
  const closeNotification = useUiStore((state) => state.closeNotification);
  const toggleRightPanel = useUiStore((state) => state.toggleRightPanel);
  const rightPanelOpen = useUiStore((state) => state.rightPanelOpen);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const searchPopoverRootRef = React.useRef<HTMLDivElement | null>(null);
  const notificationTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const profileMenuRootRef = React.useRef<HTMLDivElement | null>(null);

  const pageId = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);
  const pageLabel = pageLabelMap[pageId] || '샘플부동산 비서';
  const searchableItems = React.useMemo(() => [...realEstateMockData.customers.map((customer) => customer.name), ...realEstateMockData.properties.map((property) => property.name)], []);
  const suggestions = search.trim() ? searchableItems.filter((searchableItem) => searchableItem.includes(search.trim())).slice(0, 6) : [];
  const autocompleteOpen = showAutocomplete && suggestions.length > 0;
  const autocompleteFloating = useFloating({
    open: autocompleteOpen,
    placement: 'bottom-start',
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(headerPopoverOffset),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ elements, rects }) {
          elements.floating.style.width = `${rects.reference.width}px`;
        },
      }),
    ],
  });
  const notificationFloating = useFloating({
    open: notificationOpen,
    strategy: 'fixed',
    placement: 'bottom-end',
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [offset(headerPopoverOffset), flip(), shift({ padding: 8 })],
  });
  const profileFloating = useFloating({
    open: menuOpen,
    strategy: 'fixed',
    placement: 'bottom-end',
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [offset(headerPopoverOffset), flip(), shift({ padding: 8 })],
  });

  React.useEffect(() => {
    if (notificationOpen) {
      void notificationFloating.update();
    }

    if (menuOpen) {
      void profileFloating.update();
    }
  }, [menuOpen, notificationFloating, notificationOpen, profileFloating, rightPanelOpen]);

  const setNotificationTriggerRef = React.useCallback((node: HTMLButtonElement | null) => {
    notificationTriggerRef.current = node;
  }, []);

  const setProfileMenuRootRef = React.useCallback((node: HTMLDivElement | null) => {
    profileMenuRootRef.current = node;
  }, []);

  const setHeaderActionsRef = React.useCallback((node: HTMLDivElement | null) => {
    notificationFloating.refs.setReference(node);
    profileFloating.refs.setReference(node);
  }, [notificationFloating.refs, profileFloating.refs]);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 10000);
    return () => window.clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setMenuOpen(false);
        closeNotification();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeNotification]);

  React.useEffect(() => {
    if (!showAutocomplete && !notificationOpen && !menuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const eventTarget = event.target;
      if (!(eventTarget instanceof Node)) {
        return;
      }

      if (
        searchPopoverRootRef.current?.contains(eventTarget) ||
        notificationTriggerRef.current?.contains(eventTarget) ||
        profileMenuRootRef.current?.contains(eventTarget) ||
        (eventTarget instanceof Element && eventTarget.closest('.notification-panel'))
      ) {
        return;
      }

      setShowAutocomplete(false);
      setMenuOpen(false);
      closeNotification();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [closeNotification, menuOpen, notificationOpen, showAutocomplete]);

  const openSearchPopover = () => {
    setMenuOpen(false);
    closeNotification();
    setShowAutocomplete(true);
  };

  const onNotificationClick = () => {
    setMenuOpen(false);
    setShowAutocomplete(false);
    toggleNotification();
  };

  const onProfileMenuClick = () => {
    closeNotification();
    setShowAutocomplete(false);
    setMenuOpen((prevOpen) => !prevOpen);
  };

  return (
    <header className="header" data-header="true">
      <button
        type="button"
        onClick={(event) => {
          event.currentTarget.blur();
          onMenuToggle?.();
        }}
        className="r-hide-desktop navatar-trigger"
        style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 6, lineHeight: 0, borderRadius: 8 }}
      >
        {AppIcons.menu}
      </button>

      <div className="header-breadcrumb">
        <span>홈</span>
        {AppIcons.chevronRight}
        <strong>{pageLabel}</strong>
      </div>

      <div ref={searchPopoverRootRef} className="header-search">
        <div ref={autocompleteFloating.refs.setReference} className="header-search-box">
          <span style={{ color: 'var(--color-muted)', flexShrink: 0 }}>{AppIcons.search}</span>
          <input
            ref={searchInputRef}
            className="header-search-input"
            value={search}
            onFocus={openSearchPopover}
            onBlur={() => window.setTimeout(() => setShowAutocomplete(false), 120)}
            onChange={(event) => {
              const nextSearchValue = event.target.value;
              setSearch(nextSearchValue);
              openSearchPopover();
              onSearch?.(nextSearchValue);
            }}
            placeholder="고객명, 매물명, 주소 검색"
          />
          <kbd className="header-search-kbd">⌘K</kbd>
        </div>
        <AnimatePresence>
          {autocompleteOpen ? (
            <motion.div
              role="menu"
              className="popover-left popover-menu"
              initial={popoverInitial}
              animate={popoverAnimate}
              exit={popoverExit}
              transition={popoverTransition}
              ref={autocompleteFloating.refs.setFloating}
              style={{ ...autocompleteFloating.floatingStyles, zIndex: 201, opacity: 0, transformOrigin: 'top left' }}
            >
              {suggestions.map((suggestion) => {
                const matchIndex = suggestion.indexOf(search.trim());
                return (
                  <button key={suggestion} type="button" className="popover-item" onMouseDown={(event) => event.preventDefault()} onClick={() => { setSearch(suggestion); setShowAutocomplete(false); showToast('검색: ' + suggestion, 'info'); onSearch?.(suggestion); }}>
                    <span style={{ color: 'var(--color-muted)', lineHeight: 0 }}>{AppIcons.search}</span>
                    <span>{matchIndex >= 0 ? <>{suggestion.slice(0, matchIndex)}<mark style={{ background: 'var(--color-brand)', color: '#fff', borderRadius: 3, padding: '0 2px' }}>{search.trim()}</mark>{suggestion.slice(matchIndex + search.trim().length)}</> : suggestion}</span>
                  </button>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div ref={setHeaderActionsRef} className="header-actions">
        <div className="header-time">
          {now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>

        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            setShowAutocomplete(false);
            closeNotification();
            toggleRightPanel();
          }}
          className="navatar-trigger"
          title="샘플부동산 비서"
          style={{
            background: rightPanelOpen ? 'var(--color-bg)' : 'none',
            border: 'none',
            cursor: 'pointer',
            color: rightPanelOpen ? 'var(--color-brand)' : 'var(--color-muted)',
            padding: '6px 8px',
            borderRadius: 8,
            flexShrink: 0,
            transition: 'background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.15s',
            fontSize: 14,
            fontWeight: 800,
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          AI
        </button>

        <button
          ref={setNotificationTriggerRef}
          type="button"
          onClick={onNotificationClick}
          className="navatar-trigger"
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 6, borderRadius: 8, flexShrink: 0 }}
        >
          {AppIcons.bell}
          <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: 'var(--color-danger)', borderRadius: '50%', border: '1.5px solid #fff' }} />
        </button>

        <div ref={setProfileMenuRootRef} className="navatar-trigger header-profile-btn" onClick={onProfileMenuClick}>
          <div className="header-avatar">KM</div>
          <div className="header-profile-name">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg)', lineHeight: 1.2 }}>{currentUser?.displayName || '홍진영 소장'}</div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>샘플부동산</div>
          </div>
          <span className="header-profile-chevron" style={{ color: 'var(--color-muted)', flexShrink: 0 }}>{AppIcons.chevronDown}</span>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <button
              aria-label="사용자 메뉴 닫기"
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'transparent', border: 'none' }}
            />
            <motion.section
              role="menu"
              className="profile-popover notification-panel"
              initial={popoverInitial}
              animate={popoverAnimate}
              exit={popoverExit}
              transition={popoverTransition}
              ref={profileFloating.refs.setFloating}
              style={{
                ...profileFloating.floatingStyles,
                width: 220,
                padding: 8,
                zIndex: 201,
                background: '#fff',
                borderRadius: 14,
                border: '1px solid #D5DBDB',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.16)',
                overflow: 'hidden',
                transformOrigin: 'top right',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div style={{ padding: 8, borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-fg)' }}>{currentUser?.displayName || '홍진영 소장'}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>샘플부동산</div>
              </div>
              <button type="button" onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'color-mix(in oklch, var(--color-danger), transparent 92%)', border: '1px solid color-mix(in oklch, var(--color-danger), transparent 70%)', borderRadius: 8, cursor: 'pointer', color: 'var(--color-danger)', fontSize: 13, fontWeight: 600, padding: '8px 10px' }}>
                {AppIcons.user}
                로그아웃
              </button>
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
      <MotionNotificationPanel open={notificationOpen} onClose={closeNotification} floatingRef={notificationFloating.refs.setFloating} floatingStyles={notificationFloating.floatingStyles} />
    </header>
  );
}

function MotionNotificationPanel({ open, onClose, floatingRef, floatingStyles }: { open: boolean; onClose: () => void } & FloatingPanelPosition) {
  const [filter, setFilter] = React.useState<NotificationFilter>('전체');
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
    <AnimatePresence>
      {open ? (
        <>
          <button
            aria-label="알림 패널 닫기"
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'transparent', border: 'none' }}
          />

          <motion.section
            className="notification-panel"
            initial={popoverInitial}
            animate={popoverAnimate}
            exit={popoverExit}
            transition={popoverTransition}
            ref={floatingRef}
            style={{
              ...floatingStyles,
              width: 360,
              zIndex: 201,
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #D5DBDB',
              boxShadow: '0 2px 4px #00000021',
              overflow: 'hidden',
              transformOrigin: 'top right',
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
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
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
        padding: '12px 16px',
        border: 'none',
        borderBottom: divider ? '1px solid #F3F4F6' : 'none',
        background: hovered ? '#F9FAFB' : '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        gap: 10,
        fontFamily: 'inherit',
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 1, marginTop: 2, color: notificationColorMap[notification.type] }}>
        {resolveNotificationIcon(notification.icon)}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#111827', fontSize: 13, fontWeight: notification.read ? 500 : 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {notification.title}
          </span>
          {!notification.read && <span style={{ width: 5, height: 5, background: '#2563EB', borderRadius: '50%', flexShrink: 0 }} />}
        </span>
        <span style={{ display: 'block', marginTop: 3, color: '#6B7280', fontSize: 12, lineHeight: 1.4 }}>
          {notification.desc}
        </span>
        <span style={{ display: 'block', marginTop: 5, color: '#9CA3AF', fontSize: 11 }}>
          {notification.time}
        </span>
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
