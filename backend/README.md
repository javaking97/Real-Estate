# real-estate

Spring Boot 3.5 / Java 21 기반의 경량 auth + me 백엔드 템플릿

## 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Spring Boot 3.5, Java 21 |
| 인증 | JWT (HS256) + Refresh Token (Redis) |
| ORM | MyBatis + MyBatis Generator |
| DB | MySQL 8 |
| 배치 | Spring Batch + 수동 실행 API |
| 캐시/세션 | Redis |
| 문서화 | springdoc-openapi (Swagger UI) |
| 마이그레이션 | Flyway |
| 로깅 | Logback + log4jdbc |

## 사전 요구사항

- Java 21+
- Docker & Docker Compose
- Gradle 8+

## 빠른 시작

### 1. 인프라 기동

```bash
cd ..
docker compose up -d mysql redis
```

MySQL(3306), Redis(6379)가 기동됩니다.

### 2. 로컬 설정 파일 생성

```bash
cp src/main/resources/application-local.yml.example \
   src/main/resources/application-local.yml
```

`application-local.yml`은 `.gitignore`에 포함됩니다. DB 접속 정보와 `jwt.secret`을 수정하세요.

> **경고**: `jwt.secret`은 최소 32바이트 이상의 값으로 변경하세요.

### 3. 애플리케이션 실행

```bash
# local 프로파일 (기본)
gradle bootRun

# dev 프로파일
gradle bootRun --args='--spring.profiles.active=dev'
```

### 4. Swagger UI 확인

`http://localhost:8080/api/swagger-ui.html`

## SQL 로깅

local 프로파일은 log4jdbc를 사용한다.

```yaml
spring:
  datasource:
    hikari:
      driver-class-name: net.sf.log4jdbc.sql.jdbcapi.DriverSpy
      jdbc-url: jdbc:log4jdbc:mysql://localhost:3306/real_estate_db
```

local 로그 정책:

| Logger | 설정 |
|---|---|
| `jdbc.sqlonly` | ON |
| `jdbc.sqltiming` | OFF |
| `jdbc.resultsettable` | ON |
| `jdbc.connection` | OFF |

dev 로그 정책:

| Logger | 설정 |
|---|---|
| `jdbc.sqlonly` | OFF |
| `jdbc.sqltiming` | ON |
| `jdbc.resultsettable` | OFF |
| `jdbc.connection` | OFF |

dev에서 log4jdbc를 쓰려면 `DB_URL`을 `jdbc:log4jdbc:mysql://...` 형식으로 주입하고 driver를 `net.sf.log4jdbc.sql.jdbcapi.DriverSpy`로 맞춘다.

## MyBatis Generator

Generator는 `ose.tcrserver-main`과 같은 MyBatis Dynamic SQL 방식으로 `model`, `mapper interface`, `DynamicSqlSupport`를 생성한다.
서비스 코드는 수기 mapper가 아니라 MBG가 만든 `generated` mapper를 기준으로 사용한다.

### 1. 인프라 기동

```bash
cd ..
docker compose up -d mysql redis
cd backend
```

### 2. 로컬 Generator 설정 생성

```bash
cp src/main/resources/mybatis-gen-configs/real-estate/generator.properties.example \
   src/main/resources/mybatis-gen-configs/real-estate/generator.properties
```

`generator.properties`는 `.gitignore`에 포함된다. 로컬 DB 접속 정보를 수정한 뒤 실행한다.
루트 `.env`에서 `MYSQL_HOST_PORT`를 `3307`처럼 바꿨다면 `mbg.jdbc.url` 포트도 동일하게 맞춘다.

### 3. 스키마 생성

처음 실행하는 DB라면 애플리케이션 또는 테스트를 먼저 실행해 Flyway 마이그레이션을 적용한다.

```bash
./gradlew test
```

### 4. 코드 생성

```bash
./gradlew mbg
```

`mbg` task는 `-overwrite` 옵션으로 같은 이름의 생성 파일을 덮어쓴다.

생성 대상은 다음과 같다.

| 대상 | 경로 |
|---|---|
| Model | `src/main/java/kr/co/realestate/domain/user/generated/model` |
| Mapper interface | `src/main/java/kr/co/realestate/domain/user/generated/mapper` |
| Dynamic SQL Support | `src/main/java/kr/co/realestate/domain/user/generated/support` |

현재 대상 테이블은 `users`, `roles`, `user_roles`다.

### 5. 테이블 추가

새 테이블은 `src/main/resources/mybatis-gen-configs/real-estate/user/genConfig_real_estate_user.xml`에 추가한다.

```xml
<table tableName="properties" domainObjectName="Property">
    <generatedKey column="id" sqlStatement="MySql" identity="true"/>
</table>
```

생성된 mapper는 `@Mapper`가 붙어 `DataSourceConfig`의 `@MapperScan` 대상에 포함된다.
`nullCatalogMeansCurrent=true` 옵션으로 현재 DB 카탈로그만 introspection 하므로 `performance_schema.users` 같은 MySQL 시스템 테이블과 충돌하지 않는다.
generated 파일은 직접 수정하지 않는다. 테이블 변경 시 generator XML을 수정한 뒤 `./gradlew mbg`로 다시 생성한다.

## 배치 실행

기본 샘플 배치 Job은 `templateMaintenanceJob` 입니다.

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/v1/batch/jobs/template-maintenance/run` | 샘플 배치 실행 |
| GET | `/api/v1/batch/jobs/template-maintenance/executions/latest` | 최근 실행 결과 조회 |

`spring.batch.job.enabled=false` 로 설정되어 있으므로 애플리케이션 시작 시 자동 실행되지 않습니다.

## 기본 계정

> **반드시 첫 부팅 후 admin 비밀번호를 변경하세요.**

| 항목 | 값 |
|---|---|
| username | `admin` |
| password | `Admin1234!` |
| role | ROLE_ADMIN |

## 프로파일

| 프로파일 | 용도 |
|---|---|
| `local` | 로컬 개발. Swagger UI 활성. |
| `dev` | 개발 서버. env 변수로 credentials 주입. |

## API 엔드포인트 (기본)

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/v1/auth/login` | 로그인 |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| GET  | `/api/v1/users/me` | 내 정보 조회 |
| POST | `/api/v1/batch/jobs/template-maintenance/run` | 샘플 배치 실행 |

권한 부족(403)과 인증 실패(401)는 모두 JSON 에러 응답으로 일관되게 반환합니다.

## 외부 HTTP 클라이언트

외부 API 연동이 필요하면 WebFlux `WebClient` 대신 Spring MVC 스택에 맞춰 `RestClient`를 사용한다.
reactive stream 처리가 필요한 요구사항이 생기기 전까지 `spring-boot-starter-webflux`는 추가하지 않는다.

## Dockerfile 빌드

```bash
docker build -t real-estate-app .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DB_URL=jdbc:mysql://... \
  -e DB_USERNAME=... \
  -e DB_PASSWORD=... \
  -e REDIS_HOST=... \
  -e JWT_SECRET=... \
  real-estate-app
```
