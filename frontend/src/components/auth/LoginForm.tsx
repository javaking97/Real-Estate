import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/types/api';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [focused, setFocused] = useState('');

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
    <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 400, animation: 'loginIn 0.5s cubic-bezier(0.34,1.1,0.64,1) forwards' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', background: '#ffffff', borderRadius: 20, border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 20px 60px rgba(15,23,42,0.09), 0 4px 16px rgba(15,23,42,0.05)', overflow: 'hidden' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg,#2563EB,#6366F1,#2563EB)', backgroundSize: '200% 100%' }} />

        <div style={{ padding: '32px 34px 36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#1D4ED8,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(99,102,241,0.35)', marginBottom: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.4px' }}>RealEstate</div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 3, letterSpacing: '0.06em' }}>Real Estate Management Platform</div>
          </div>

          <div style={{ height: 1, background: '#F1F5F9', marginBottom: 24 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7 }}>아이디</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused === 'id' ? '#2563EB' : '#CBD5E1', transition: 'color 0.2s' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <input
                  className="l-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="사무소 아이디 입력"
                  autoComplete="username"
                  onFocus={() => setFocused('id')}
                  onBlur={() => setFocused('')}
                  style={{ width: '100%', padding: '11px 14px 11px 36px', background: focused === 'id' ? '#F8FAFF' : '#F8FAFC', border: focused === 'id' ? '1px solid #2563EB' : '1px solid #E2E8F0', borderRadius: 9, color: '#0F172A', fontFamily: 'inherit', fontSize: 15, outline: 'none', boxSizing: 'border-box', boxShadow: focused === 'id' ? '0 0 0 3px rgba(37,99,235,0.08)' : 'none' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: '0.07em', textTransform: 'uppercase' }}>비밀번호</label>
                <button type="button" style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>비밀번호 찾기</button>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused === 'pw' ? '#2563EB' : '#CBD5E1', transition: 'color 0.2s' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <input
                  className="l-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="비밀번호 입력"
                  autoComplete="current-password"
                  onFocus={() => setFocused('pw')}
                  onBlur={() => setFocused('')}
                  style={{ width: '100%', padding: '11px 40px 11px 36px', background: focused === 'pw' ? '#F8FAFF' : '#F8FAFC', border: focused === 'pw' ? '1px solid #2563EB' : '1px solid #E2E8F0', borderRadius: 9, color: '#0F172A', fontFamily: 'inherit', fontSize: 15, outline: 'none', boxSizing: 'border-box', boxShadow: focused === 'pw' ? '0 0 0 3px rgba(37,99,235,0.08)' : 'none' }}
                />
                <button type="button" onClick={() => setIsPasswordVisible((v) => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 2, lineHeight: 0 }}>
                  {isPasswordVisible ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#DC2626' }}>{errorMessage}</div>
            )}

            <button type="submit" disabled={isLoading} className="l-btn" style={{ width: '100%', padding: '13px', marginTop: 2, background: isLoading ? '#93C5FD' : 'linear-gradient(135deg,#1D4ED8,#4F46E5)', border: 'none', borderRadius: 9, color: '#fff', fontSize: 15, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(37,99,235,0.28)', letterSpacing: '0.01em' }}>
              {isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.7s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  로그인 중...
                </>
              ) : (
                <>
                  로그인
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </>
              )}
            </button>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: '#CBD5E1' }}>접속 권한이 없으신가요? </span>
            <button type="button" style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>관리자에게 문의</button>
          </div>
        </div>
      </form>
    </div>
  );
}
