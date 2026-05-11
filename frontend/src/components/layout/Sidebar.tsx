import { useLocation, useNavigate } from 'react-router-dom';
import { AppIcons } from '@/components/icons/AppIcons';
import { realEstateMockData } from '@/lib/mock-data';

type NavItem = {
  id: string;
  label: string;
  icon: keyof typeof AppIcons;
  badge?: string;
  count?: number;
  urgent?: boolean;
};

type SidebarProps = {
  mobileOpen?: boolean;
  mobileState?: 'opening' | 'closing';
  onMobileClose?: () => void;
};

export function Sidebar({ mobileOpen, mobileState, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: '샘플부동산 비서', icon: 'home' },
    { id: 'today', label: '오늘 할 일', icon: 'check', count: 4 },
    { id: 'customers', label: '고객관리', icon: 'users', count: realEstateMockData.customers.filter((customer) => customer.status === '진행중' || customer.status === '신상담').length },
    { id: 'properties', label: '매물관리', icon: 'building', count: realEstateMockData.properties.length },
    { id: 'consultations', label: '상담관리', icon: 'chat', count: 2, urgent: true },
    { id: 'schedule', label: '일정관리', icon: 'calendar', count: realEstateMockData.schedules.length },
    { id: 'templates', label: '템플릿관리', icon: 'template', count: realEstateMockData.templates.filter((template) => template.status !== '작성 완료').length },
    { id: 'analytics', label: '분석 리포트', icon: 'chart', badge: 'Beta' },
    { id: 'tools', label: '업무 도구', icon: 'link' },
  ];

  const onNav = (targetPage: string) => {
    if (targetPage === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${targetPage}`);
    }
    onMobileClose?.();
  };

  return (
    <aside className={mobileOpen ? 'navatar-drawer' : undefined} data-sidebar="true" data-mobile-open={mobileOpen} data-state={mobileState} style={{
      width: 220, minWidth: 220, height: '100vh', position: 'sticky', top: 0,
      background: '#1B2B4B', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', lineHeight: 0 }}>{AppIcons.home}</span>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>RealEstate</div>
            <div className="sidebar-subtitle" style={{ color: '#94A3B8', fontSize: 11, fontWeight: 400 }}>Management</div>
          </div>
          {mobileOpen && (
            <button
              onClick={onMobileClose}
              className="r-show-mobile"
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4, lineHeight: 0 }}
            >
              {AppIcons.x}
            </button>
          )}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const active = page === item.id;
          const displayCount = item.count && item.count > 99 ? '99+' : item.count;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, border: 'none',
                background: active ? '#2563EB' : 'transparent',
                color: active ? '#fff' : '#94A3B8',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 600 : 400,
                textAlign: 'left', transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(event) => {
                if (!active) {
                  event.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                }
              }}
              onMouseLeave={(event) => {
                if (!active) {
                  event.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ opacity: active ? 1 : 0.7 }}>{AppIcons[item.icon]}</span>
              <span className="sidebar-label" style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="sidebar-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontSize: 10, padding: '2px 5px', borderRadius: 4, background: '#F59E0B', color: '#fff', fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
              {item.count && item.count > 0 ? (
                <span className="sidebar-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontSize: 11, padding: '2px 6px', borderRadius: 99, background: item.urgent ? '#EF4444' : (active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)'), color: '#fff', fontWeight: 700, minWidth: 18, minHeight: 18, textAlign: 'center' }}>{displayCount}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => onNav('settings')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, border: 'none',
            background: page === 'settings' ? '#2563EB' : 'transparent',
            color: page === 'settings' ? '#fff' : '#94A3B8', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: page === 'settings' ? 600 : 400,
            width: '100%', textAlign: 'left',
          }}
        >
          {AppIcons.settings}
          <span className="sidebar-label">설정</span>
        </button>
      </div>

      <div className="sidebar-promo" style={{
        margin: '0 10px 12px', padding: '12px', borderRadius: 14,
        background: 'linear-gradient(145deg, rgba(37,99,235,0.28), rgba(124,58,237,0.2))',
        border: '1px solid rgba(147,197,253,0.22)', boxShadow: '0 10px 26px rgba(15,23,42,0.22)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DBEAFE', background: 'rgba(255,255,255,0.12)', borderRadius: 9, lineHeight: 0 }}>{AppIcons.sparkle}</span>
          <span style={{ color: '#F8FAFC', fontSize: 12, fontWeight: 800 }}>AI 업무 비서</span>
        </div>
        <div style={{ color: '#CBD5E1', fontSize: 11, marginBottom: 10, lineHeight: 1.55 }}>상담 요약·문자 작성·매물 추천을 빠르게 처리하세요.</div>
        <button onClick={() => onNav('today')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#EFF6FF', border: '1px solid rgba(191,219,254,0.9)', color: '#1D4ED8', borderRadius: 9, padding: '7px 10px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>오늘 할 일 확인</button>
      </div>
    </aside>
  );
}
