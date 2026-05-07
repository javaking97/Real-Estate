# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

`backend/` (Spring Boot 3.5 / Java 21 / Gradle) + `frontend/` (React 19 / Vite / TypeScript) 모노레포. 루트 `package.json`이 두 쪽을 모두 orchestrate한다.

## 개발 명령어

### 인프라 (MySQL + Redis)

```bash
npm run infra          # Docker로 MySQL(3306) + Redis(6379) 기동
```

### 백엔드

```bash
npm run backend:local  # application-local.yml 없으면 example 복사 후 bootRun
npm run backend        # bootRun (application-local.yml 이미 있을 때)
cd backend && ./gradlew test           # 백엔드 테스트 단독 실행
cd backend && ./gradlew test --tests "kr.co.realestate.domain.auth.service.AuthServiceTest"  # 단일 테스트 클래스
cd backend && ./gradlew mbg            # MyBatis Generator 코드 재생성
```

### 프론트엔드

```bash
npm run dev            # Vite 개발 서버 (포트 5173)
cd frontend && npm run lint            # ESLint
cd frontend && npm run format          # Prettier 포맷
cd frontend && npm test                # Vitest 테스트 실행
cd frontend && npm run test:coverage   # 커버리지 포함
```

### 통합

```bash
npm test               # 프론트엔드 + 백엔드 테스트 모두 실행
npm run build          # 프론트엔드 빌드 + 백엔드 bootJar
docker compose up -d   # MySQL / Redis / backend / frontend 컨테이너 전부 기동
```

## 아키텍처

### 백엔드 패키지 구조

```
kr.co.realestate
├── config/          — 앱 설정 (DataSource, Cache, Batch, WebConfig 등)
├── security/        — Spring Security 설정, JWT 필터/provider, CustomUserDetails
├── exceptions/      — GlobalExceptionHandler, BizException, ApplicationException
├── common/          — RequestTimingInterceptor, CorrelationIdFilter, TraceContext
└── domain/
    ├── auth/        — 로그인·로그아웃·토큰 갱신 (controller → service)
    ├── user/
    │   ├── generated/  — MBG 자동생성 코드 (model, mapper, DynamicSqlSupport)
    │   └── service/    — UserService, UserRoleQueryService
    ├── batch/       — Spring Batch 샘플 job, 수동 실행 API
    └── common/      — ApiResponse, ErrorCode, BaseVO, ProbeController
```

**generated 디렉터리 파일은 직접 수정하지 않는다.** 테이블 스키마 변경 후 `./gradlew mbg`로 재생성한다.

### API 응답 규격

성공: `{ resultCode: 200, resultMsg: "success", result: T }`
에러: `{ status, divisionCode, resultMsg, errors?, reason?, traceId?, ... }`

백엔드 컨텍스트 패스는 `/api`, 버전 prefix는 `/v1`. 예: `POST /api/v1/auth/login`.

### 프론트엔드 구조

```
src/
├── app/
│   ├── router/      — ProtectedRoute / PublicRoute 래퍼, 라우트 정의
│   ├── store/       — Zustand 스토어 (auth.ts, ui.ts)
│   └── providers/   — React Query, ErrorBoundary 등 전역 Provider
├── components/
│   ├── layout/      — AppLayout, Header, Sidebar
│   └── ui/          — 공통 UI 컴포넌트 (PageHeader, KpiCardGrid, SearchToolbar 등)
├── lib/
│   ├── api/         — client.ts(fetch 래퍼), auth.ts, user.ts
│   ├── types/       — api.ts, auth.ts, user.ts 타입 정의
│   └── utils/       — cn.ts, storage.ts(localStorage 토큰)
├── pages/           — 라우트별 페이지 (home, today, customers, ...)
└── hooks/           — useAuth, useCurrentUser, useAnimatedPresence
```

`@/` alias는 `src/`를 가리킨다.

### 인증 흐름

- 토큰(accessToken, refreshToken)은 localStorage에 저장 (`storage.ts`)
- `useAuthStore` (Zustand)가 토큰 상태와 login/logout/refresh 액션을 관리
- `apiRequest`는 저장된 accessToken을 `Authorization: Bearer` 헤더로 자동 추가
- 모든 페이지 라우트는 `ProtectedRoute`로 감싸고, `/login`은 `PublicRoute`로 분리

### 로컬 설정 파일

백엔드 첫 실행 전 아래 파일을 복사한다:

```bash
cp backend/src/main/resources/application-local.yml.example \
   backend/src/main/resources/application-local.yml
```

`application-local.yml`은 gitignore 대상이다. DB 접속 정보와 `jwt.secret`을 수정한다 (secret은 32바이트 이상).

MyBatis Generator 실행 전:

```bash
cp backend/src/main/resources/mybatis-gen-configs/real-estate/generator.properties.example \
   backend/src/main/resources/mybatis-gen-configs/real-estate/generator.properties
```

### MyBatis Generator (MBG)

새 테이블을 추가할 때는 `genConfig_real_estate_user.xml`에 `<table>` 항목을 추가한 뒤 `./gradlew mbg`로 코드를 재생성한다. 생성된 mapper는 `DataSourceConfig`의 `@MapperScan` 범위에 자동 포함된다.

### 프로파일

| 프로파일 | 용도 |
|---|---|
| `local` | 로컬 개발. Swagger UI 활성 (`/api/swagger-ui.html`). log4jdbc SQL 로깅 ON. |
| `dev` | 개발 서버. 환경 변수로 credentials 주입. |

### 기본 계정

| 항목 | 값 |
|---|---|
| username | `admin` |
| password | `Admin1234!` |

첫 부팅 후 비밀번호를 변경한다.
