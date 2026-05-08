# Real Estate

Spring Boot backend와 React frontend로 구성된 부동산 관리 모노레포다.

## 운영 구조

```text
Vercel Frontend
  └─ https://real-estate-sepia-eta.vercel.app
      └─ API_BASE_URL=https://real-estate-dev.duckdns.org
          └─ EC2 Docker Compose
              ├─ backend: Spring Boot
              └─ redis: Redis
                  └─ RDS MySQL
                      └─ real-estate-2.c9gkm8cm4ufs.eu-north-1.rds.amazonaws.com / real_estate_db
```

## 주요 URL

| 항목 | URL |
|---|---|
| Frontend | https://real-estate-sepia-eta.vercel.app |
| Backend API | https://real-estate-dev.duckdns.org |
| Healthcheck | https://real-estate-dev.duckdns.org/api/v1/probe/liveness |
| Swagger | https://real-estate-dev.duckdns.org/api/swagger-ui/index.html |

## 프로젝트 구조

```text
.
├── backend/                 # Spring Boot 3.5 / Java 21 / Gradle
├── frontend/                # React 19 / Vite / TypeScript
├── .github/workflows/       # GitHub Actions
├── docker-compose.yml       # EC2 backend + redis 실행 기준
├── .env.example             # 환경변수 예시
└── package.json             # 로컬 개발/검증 스크립트
```

## 로컬 개발

현재 로컬 개발 기본 방식은 frontend만 실행하고 API는 EC2 backend를 사용한다.

```bash
npm --prefix frontend ci
npm run frontend
```

frontend 개발 서버는 기본적으로 `http://localhost:5173`에서 실행된다.

API 주소를 명시하려면 `frontend/.env`를 생성한다.

```bash
API_BASE_URL=https://real-estate-dev.duckdns.org
```

로컬 backend까지 실행할 때만 Redis와 backend를 함께 실행한다.

```bash
cp backend/src/main/resources/application-local.yml.example backend/src/main/resources/application-local.yml
npm run backend:local
```

## 루트 명령어

| 명령어 | 설명 |
|---|---|
| `npm run frontend` | frontend 개발 서버 실행 |
| `npm run frontend:lint` | frontend ESLint 실행 |
| `npm run frontend:test` | frontend 테스트 실행 |
| `npm run frontend:build` | frontend 프로덕션 빌드 |
| `npm run backend` | backend 실행 |
| `npm run backend:local` | local 설정 파일 생성 후 backend 실행 |
| `npm run backend:test` | backend 테스트 실행 |
| `npm run backend:build` | backend 빌드 |
| `npm test` | frontend + backend 테스트 |
| `npm run build` | frontend + backend 빌드 |

## EC2 배포

EC2에서는 Docker Compose로 `backend`와 `redis`를 실행한다. MySQL은 RDS를 사용한다.

```bash
cp .env.example .env
docker compose --env-file .env up -d --build redis backend
docker compose up -d --build --force-recreate backend
docker compose ps
```

EC2 `.env`에는 실제 운영 값을 넣는다. `.env`는 commit하지 않는다.

필수 환경변수:

```bash
MYSQL_DATABASE=real_estate_db
MYSQL_USER=admin
MYSQL_PASSWORD=<rds-password>
JWT_SECRET=<32-bytes-or-longer-secret>
APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://real-estate-sepia-eta.vercel.app,http://localhost:5173
BACKEND_HOST_PORT=8080
REDIS_HOST_PORT=6379
```

## GitHub Actions

`.github/workflows/deploy-ec2.yml`은 `main` push 또는 수동 실행 시 동작한다.

흐름:

1. frontend 의존성 설치
2. frontend lint
3. frontend test
4. Java 21 + Gradle 9.4.1 설정
5. backend test
6. EC2 접속
7. `main` 최신화
8. `docker compose --env-file .env up -d --build redis backend`
9. healthcheck 호출

GitHub repository secrets:

| Secret | 설명 |
|---|---|
| `EC2_HOST` | EC2 public IP 또는 도메인 |
| `EC2_USER` | SSH 사용자. 예: `ubuntu` |
| `EC2_SSH_KEY` | EC2 접속 private key |

## Vercel 배포

Vercel은 GitHub repository의 `main` branch push를 기준으로 frontend를 자동 배포한다.

Vercel 환경변수:

```bash
API_BASE_URL=https://real-estate-dev.duckdns.org
```

## 검증

```bash
npm run frontend:lint
npm run frontend:test
npm run backend:test
npm test
npm run build
```
