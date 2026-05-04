import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#F4F6FB' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-8%', left: '-6%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(199,210,254,0.7) 0%, transparent 70%)', animation: 'blobA 14s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,219,254,0.6) 0%, transparent 70%)', animation: 'blobB 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '35%', right: '15%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,231,255,0.5) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(148,163,184,0.12) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <span style={{ fontSize: 11, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>사무소 전용 시스템</span>
        <span style={{ fontSize: 11, color: '#CBD5E1', letterSpacing: '0.06em' }}>v2.4.1</span>
      </div>
      <LoginForm />
      <div style={{ position: 'absolute', bottom: 22, fontSize: 11, color: '#CBD5E1', zIndex: 10, letterSpacing: '0.04em' }}>© 2026 RealEstate · 무단 접근 금지</div>
    </div>
  );
}
