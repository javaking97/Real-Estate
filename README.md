# real-estate

`backend` + `frontend` 구조로 정리한 real-estate 모노레포다.

## 구조

```text
real-estate/
├── backend/   # real-estate backend
└── frontend/  # real-estate frontend
```

## backend

- Spring Boot 3.5 / Java 21 / Gradle
- auth + me only
- JWT + Refresh Token
- MySQL / Redis / Flyway / Swagger / Batch(sample)

## frontend

- React 19 / Vite / TypeScript
- auth only starter
- Zustand + React Query
- Tailwind
- login / logout / refresh / `/users/me`

## 빠른 시작

루트에서 실행한다.

```bash
npm install --prefix frontend
npm run dev
```

### backend

```bash
npm run backend:local
```

### frontend

```bash
npm install --prefix frontend
npm run dev
```

## 루트 명령어

| 명령어 | 설명 |
|---|---|
| `npm run dev` | frontend 개발 서버 실행 |
| `npm run build` | frontend + backend 빌드 |
| `npm test` | frontend + backend 테스트 |
| `npm run backend` | backend Spring Boot 실행 |
| `npm run backend:local` | local 설정 파일 생성 후 backend Spring Boot 실행 |
| `npm run setup:infra` | Docker Desktop 설치/실행 |
| `npm run infra` | MySQL/Redis 컨테이너 실행 |
| `docker compose up -d` | MySQL/Redis/backend/frontend 컨테이너 실행 |
| `docker compose down` | 컨테이너 종료 |

## 검증

```bash
npm test
npm run build
```

## Docker

루트에 통합 `docker-compose.yml`를 두었다.

- `mysql`
- `redis`
- `backend`
- `frontend`

frontend 컨테이너는 정적 빌드 결과를 nginx로 서빙한다.
