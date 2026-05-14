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
  onMobileClose?: () => void;
};

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
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
    <aside className="sidebar" data-sidebar="true" data-mobile-open={mobileOpen}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="sidebar-logo-box">
            <span style={{ color: '#fff', lineHeight: 0 }}>{AppIcons.home}</span>
          </div>
          <div>
            <div className="sidebar-title">RealEstate</div>
            <div className="sidebar-subtitle">Management</div>
          </div>
          {mobileOpen && (
            <button onClick={onMobileClose} className="r-show-mobile" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4, lineHeight: 0 }}>
              {AppIcons.x}
            </button>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = page === item.id;
          const displayCount = item.count && item.count > 99 ? '99+' : item.count;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`sidebar-item ${active ? 'is-active' : ''}`}
            >
              <span>{AppIcons[item.icon]}</span>
              <span className="sidebar-label" style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="sidebar-badge">
                  {item.badge}
                </span>
              )}
              {item.count && item.count > 0 ? (
                <span className={`sidebar-count ${item.urgent ? 'is-urgent' : ''}`}>{displayCount}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={() => onNav('settings')}
          className={`sidebar-item ${page === 'settings' ? 'is-active' : ''}`}
          style={{ width: '100%' }}
        >
          {AppIcons.settings}
          <span className="sidebar-label">설정</span>
        </button>
      </div>

      <div className="sidebar-promo">
        <div className="sidebar-promo-head">
          <span className="sidebar-promo-icon">{AppIcons.sparkle}</span>
          <span className="sidebar-promo-title">AI 업무 비서</span>
        </div>
        <div className="sidebar-promo-copy">상담 요약·문자 작성·매물 추천을 빠르게 처리하세요.</div>
        <button onClick={() => onNav('today')} className="sidebar-promo-btn">오늘 할 일 확인</button>
      </div>
    </aside>
  );
}
