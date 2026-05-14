import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

const todayLabel = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="login-page"
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'auto',
        backgroundColor: 'var(--color-bg)',
        padding: '20px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: '56px 56px',
            opacity: 0.45,
            maskImage: 'radial-gradient(ellipse 80% 70% at center, black 35%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at center, black 35%, transparent 90%)',
          }}
        />

        <svg
          viewBox="0 0 600 400"
          preserveAspectRatio="xMaxYMax slice"
          style={{ position: 'absolute', right: '-2%', bottom: '-2%', width: 'min(640px, 55vw)', height: 'auto', opacity: 0.06, color: 'var(--color-fg)' }}
        >
          <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
            <path d="M40 380 L40 240 L160 180 L160 320 Z" />
            <path d="M160 180 L300 110 L300 250 L160 320 Z" />
            <path d="M300 110 L460 180 L460 320 L300 250 Z" />
            <path d="M460 180 L560 140 L560 280 L460 320 Z" />
            <path d="M40 240 L160 180 M160 320 L300 250 M300 250 L460 320 M460 320 L560 280" />
            <path d="M80 290 L100 281 L100 310 L80 320 Z" />
            <path d="M80 260 L100 251 L100 280 L80 290 Z" />
            <path d="M200 240 L240 222 L240 280 L200 296 Z" />
            <path d="M340 180 L420 215 L420 260 L340 230 Z" />
            <path d="M490 215 L530 197 L530 250 L490 270 Z" />
          </g>
        </svg>

        <svg
          viewBox="0 0 200 200"
          style={{ position: 'absolute', top: 36, left: 36, width: 120, height: 120, opacity: 0.18, color: 'var(--color-domain-properties)' }}
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="100" cy="100" r="68" />
            <circle cx="100" cy="100" r="44" />
            <line x1="32" y1="100" x2="168" y2="100" />
            <line x1="100" y1="32" x2="100" y2="168" />
            <line x1="52" y1="52" x2="148" y2="148" />
            <line x1="148" y1="52" x2="52" y2="148" />
          </g>
        </svg>
      </div>

      <LoginForm />

      <div
        className="login-footer"
        style={{ position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: 'var(--color-muted)', zIndex: 10, letterSpacing: '0.04em', opacity: 0.7 }}
      >
        © 2026 RealEstate · 무단 접근 금지
      </div>
    </div>
  );
}
