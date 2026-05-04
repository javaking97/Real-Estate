# react-template

범용 SPA 프로젝트 시작용 React 템플릿이다.

## 포함 범위

- Vite + React + TypeScript
- React Router 기반 라우팅
- TanStack Query 서버 상태 관리
- Zustand 클라이언트 상태 관리
- Tailwind CSS 기반 공통 UI 컴포넌트
- React Hook Form + Zod 폼 검증
- 범용 fetch API client
- 인증 예제 feature
- Vitest + Testing Library
- Storybook
- ESLint + Prettier
- GitHub Actions CI

## 구조

```text
src/
  app/          # providers, router, styles, app-level store
  components/   # shared ui, layout, feedback components
  hooks/        # shared hooks
  lib/          # api, config, types, utils
  pages/        # route pages
```

## API 계약

`src/lib/api/client.ts`는 특정 백엔드 응답 envelope에 종속되지 않는다.
프로젝트별 응답 포맷이 필요하면 feature API 함수 또는 별도 adapter에서 변환한다.

## 실행

```bash
cp .env.example .env
npm install
npm run dev
```

## 품질 검사

```bash
npm run type-check
npm run lint
npm test
npm run build
```

## Storybook

```bash
npm run storybook
```
