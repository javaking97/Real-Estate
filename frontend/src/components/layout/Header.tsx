import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppIcons } from '@/components/icons/AppIcons';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { realEstateMockData } from '@/lib/mock-data';
import { showToast } from '@/components/ui/toast';
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence';
import { useUiStore } from '@/app/store/ui';

type HeaderProps = {
  onSearch?: (value: string) => void;
  onMenuToggle?: () => void;
};

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
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const searchPopoverRootRef = React.useRef<HTMLDivElement | null>(null);
  const notificationTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const profileMenuRootRef = React.useRef<HTMLDivElement | null>(null);

  const pageId = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);
  const pageLabelMap: Record<string, string> = {
    dashboard: '샘플부동산 비서', today: '오늘 할 일', customers: '고객관리', properties: '매물관리', consultations: '상담관리', schedule: '일정관리', templates: '템플릿관리', analytics: '분석 리포트', tools: '업무 도구', settings: '설정',
  };
  const pageLabel = pageLabelMap[pageId] || '샘플부동산 비서';
  const searchableItems = React.useMemo(() => [...realEstateMockData.customers.map((customer) => customer.name), ...realEstateMockData.properties.map((property) => property.name)], []);
  const suggestions = search.trim() ? searchableItems.filter((item) => item.includes(search.trim())).slice(0, 6) : [];
  const autocompletePresence = useAnimatedPresence(showAutocomplete && suggestions.length > 0);
  const profileMenuPresence = useAnimatedPresence(menuOpen);

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
    <header data-header="true" style={{
      height: 56, background: '#fff', borderBottom: '1px solid #E5E7EB',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
    }}>
      <button
        type="button"
        onClick={onMenuToggle}
        className="r-hide-mobile navatar-trigger"
        style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 6, lineHeight: 0, borderRadius: 8 }}
      >
        {AppIcons.menu}
      </button>

      <div className="header-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 130, color: '#9CA3AF', fontSize: 13 }}>
        <span>홈</span>
        {AppIcons.chevronRight}
        <span style={{ color: '#374151', fontWeight: 600 }}>{pageLabel}</span>
      </div>

      <div ref={searchPopoverRootRef} style={{ position: 'relative', flex: 1, maxWidth: 480, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 9, padding: '0 12px', height: 36 }}>
          <span style={{ color: '#9CA3AF', flexShrink: 0 }}>{AppIcons.search}</span>
          <input
            ref={searchInputRef}
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
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: 14, color: '#374151', minWidth: 0 }}
          />
          <kbd className="header-search-kbd" style={{ fontSize: 11, color: '#9CA3AF', background: '#F3F4F6', padding: '1px 5px', borderRadius: 4, border: '1px solid #E5E7EB', flexShrink: 0 }}>⌘K</kbd>
        </div>
        {autocompletePresence.present ? (
          <div role="menu" data-placement="bottom" data-transition-status={autocompletePresence.transitionStatus} className="popover-scale popover-left" style={{ position: 'absolute', top: 42, left: 0, right: 0, background: '#fff', border: '1px solid #D5DBDB', borderRadius: 16, boxShadow: '0 2px 4px #00000021', overflow: 'hidden', zIndex: 7000 }}>
            {suggestions.map((suggestion) => {
              const matchIndex = suggestion.indexOf(search.trim());
              return (
                <button key={suggestion} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setSearch(suggestion); setShowAutocomplete(false); showToast('검색: ' + suggestion, 'info'); onSearch?.(suggestion); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', border: 'none', borderBottom: '1px solid #F3F4F6', background: '#fff', color: '#374151', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: '#9CA3AF', lineHeight: 0 }}>{AppIcons.search}</span>
                  <span>{matchIndex >= 0 ? <>{suggestion.slice(0, matchIndex)}<mark style={{ background: '#DBEAFE', color: '#1D4ED8', borderRadius: 3, padding: '0 2px' }}>{search.trim()}</mark>{suggestion.slice(matchIndex + search.trim().length)}</> : suggestion}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', flexShrink: 0 }}>
        <div className="header-time" style={{ padding: '5px 10px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, fontWeight: 600, color: '#475569', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
          {now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <button
          ref={notificationTriggerRef}
          type="button"
          onClick={onNotificationClick}
          className="navatar-trigger"
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 6, borderRadius: 8, flexShrink: 0 }}
        >
          {AppIcons.bell}
          <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '1.5px solid #fff' }} />
        </button>

        <div ref={profileMenuRootRef} className="navatar-trigger" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative', borderRadius: 10, padding: '4px 6px', margin: '-4px -6px' }} onClick={onProfileMenuClick}>
          {profileMenuPresence.present && (
            <div role="menu" data-placement="bottom" data-transition-status={profileMenuPresence.transitionStatus} className="popover-scale" style={{ position: 'absolute', top: 48, right: 0, width: 210, background: '#fff', border: '1px solid #D5DBDB', borderRadius: 16, padding: 8, zIndex: 7000, boxShadow: '0 2px 4px #00000021' }}>
              <div style={{ padding: 8, borderRadius: 8, background: '#F8FAFC', border: '1px solid #EEF2F7', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{currentUser?.displayName || '홍진영 소장'}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>샘플부동산</div>
              </div>
              <button type="button" onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', color: '#DC2626', fontSize: 13, fontWeight: 600, padding: '8px 10px' }}>
                {AppIcons.user}
                로그아웃
              </button>
            </div>
          )}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>KM</div>
          <div className="header-profile-name">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{currentUser?.displayName || '홍진영 소장'}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>샘플부동산</div>
          </div>
          <span className="header-profile-chevron" style={{ color: '#9CA3AF', flexShrink: 0 }}>{AppIcons.chevronDown}</span>
        </div>
      </div>
      <NotificationPanel open={notificationOpen} onClose={closeNotification} />
    </header>
  );
}
