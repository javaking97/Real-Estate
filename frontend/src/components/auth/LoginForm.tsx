import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/types/api';

const LOGIN_INPUT_BASE_STYLE = {
  width: '100%',
  padding: '13px 14px 13px 40px',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-fg)',
  fontFamily: 'inherit',
  fontSize: 15,
  fontWeight: 600,
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color var(--duration-short) var(--ease-standard), background var(--duration-short) var(--ease-standard), box-shadow var(--duration-short) var(--ease-standard)',
};

function inputStyle(isFocused: boolean, paddingRight: number = 14) {
  return {
    ...LOGIN_INPUT_BASE_STYLE,
    paddingRight,
    background: isFocused ? 'var(--color-surface)' : 'var(--color-bg)',
    border: `1px solid ${isFocused ? 'var(--color-brand)' : 'var(--color-border)'}`,
    boxShadow: isFocused ? '0 0 0 3px color-mix(in oklch, var(--color-brand), transparent 90%)' : 'none',
  };
}

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'id' | 'pw' | ''>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setErrorMessage(null);

    try {
      await login({ username, password });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.reason ?? error.message);
        return;
      }
      setErrorMessage('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className="login-card-wrapper"
      style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 408, animation: 'loginIn var(--duration-base) var(--ease-standard) forwards' }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 60px color-mix(in oklch, var(--color-fg), transparent 90%), var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            height: 4,
            background: 'linear-gradient(90deg, var(--color-brand) 0%, var(--color-domain-properties) 60%, var(--color-domain-consultations) 100%)',
          }}
        />

        <div className="login-card-body" style={{ padding: '36px 32px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(140deg, var(--color-brand) 0%, color-mix(in oklch, var(--color-brand), black 14%) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px color-mix(in oklch, var(--color-brand), transparent 70%), inset 0 0 0 1px color-mix(in oklch, white, transparent 70%)',
                marginBottom: 16,
              }}
              aria-hidden="true"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="9" width="7" height="12" rx="0.5" />
                <rect x="13" y="3" width="7" height="18" rx="0.5" />
                <line x1="6.5" y1="12.5" x2="8.5" y2="12.5" />
                <line x1="6.5" y1="16" x2="8.5" y2="16" />
                <line x1="15.5" y1="7" x2="17.5" y2="7" />
                <line x1="15.5" y1="10.5" x2="17.5" y2="10.5" />
                <line x1="15.5" y1="14" x2="17.5" y2="14" />
                <line x1="15.5" y1="17.5" x2="17.5" y2="17.5" />
              </svg>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-fg)', letterSpacing: '-0.04em' }}>RealEstate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--color-domain-properties)' }} aria-hidden="true" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.04em' }}>공인중개사 통합 운영 플랫폼</span>
              <span style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--color-domain-consultations)' }} aria-hidden="true" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label htmlFor="login-username" style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>아이디</label>
              <div style={{ position: 'relative' }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focusedField === 'id' ? 'var(--color-brand)' : 'var(--color-muted)',
                    opacity: focusedField === 'id' ? 1 : 0.55,
                    transition: 'color var(--duration-short) var(--ease-standard), opacity var(--duration-short) var(--ease-standard)',
                    display: 'inline-flex',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </span>
                <input
                  id="login-username"
                  className="l-input"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="사무소 아이디 입력"
                  autoComplete="username"
                  onFocus={() => setFocusedField('id')}
                  onBlur={() => setFocusedField('')}
                  style={inputStyle(focusedField === 'id')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--color-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focusedField === 'pw' ? 'var(--color-brand)' : 'var(--color-muted)',
                    opacity: focusedField === 'pw' ? 1 : 0.55,
                    transition: 'color var(--duration-short) var(--ease-standard), opacity var(--duration-short) var(--ease-standard)',
                    display: 'inline-flex',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </span>
                <input
                  id="login-password"
                  className="l-input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="비밀번호 입력"
                  autoComplete="current-password"
                  onFocus={() => setFocusedField('pw')}
                  onBlur={() => setFocusedField('')}
                  style={inputStyle(focusedField === 'pw', 44)}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setIsPasswordVisible((previous) => !previous)}
                  aria-label={isPasswordVisible ? '비밀번호 가리기' : '비밀번호 표시'}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: 4, lineHeight: 0, borderRadius: 6, transition: 'color var(--duration-short) var(--ease-standard)' }}
                >
                  {isPasswordVisible ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'color var(--duration-short) var(--ease-standard)' }}>비밀번호를 잊으셨나요?</button>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'color-mix(in oklch, var(--color-danger), transparent 92%)',
                  border: '1px solid color-mix(in oklch, var(--color-danger), transparent 75%)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--color-danger)',
                  animation: 'slideDownFade var(--duration-short) var(--ease-standard)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="l-btn"
              style={{
                width: '100%',
                padding: '14px',
                marginTop: 4,
                background: isLoading ? 'var(--color-border)' : 'var(--color-brand)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-surface)',
                fontSize: 15,
                fontWeight: 800,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: isLoading ? 'none' : '0 10px 24px color-mix(in oklch, var(--color-brand), transparent 70%)',
                letterSpacing: '0.02em',
                transition: 'background var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-short) var(--ease-standard)',
              }}
            >
              {isLoading ? (
                <>
                  <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 0.8s linear infinite' }} aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  로그인 중...
                </>
              ) : (
                <>
                  로그인
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </>
              )}
            </button>
          </div>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)' }}>접속 권한이 없으신가요?</span>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-fg)', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>관리자에게 문의</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
