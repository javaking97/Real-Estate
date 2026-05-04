# 10. real-estate AWS EC2 Migration Guide

이 문서는 현재 개인 개발 서버로 운영 중인 `real-estate`를 AWS EC2 단일 VM으로 이관하기 위한 실행 지침서다.
대상 프리셋은 **운영 모놀리식에 가까운 소규모 EC2 운영 프리셋**이며, Kubernetes/Argo CD/Terraform 기반 MSA 운영은 이 문서의 범위가 아니다.

## 0. 단일 파일 사용 기준

이 파일은 다른 `docs/` 문서 없이 단독으로 LLM 또는 사람이 읽고 실행할 수 있어야 한다.
상대 링크에 의존하지 않는다.

LLM은 이 문서를 기준으로 작업할 때 아래 규칙을 반드시 지킨다.

```text
1. repository 구조와 현재 파일을 먼저 확인한다.
2. package manager, framework, DB 종류, runtime major version을 임의 변경하지 않는다.
3. .env, token, private key, certificate, credential 값을 출력하거나 commit하지 않는다.
4. public open port는 80/443만 허용한다.
5. SSH, Uptime Kuma, DB, Redis, backend direct는 public internet에 열지 않는다.
6. Caddy는 EC2 host systemd service로 관리한다.
7. frontend는 Vercel 배포를 유지한다.
8. Kubernetes, Argo CD, Terraform은 이 문서 범위에서 도입하지 않는다.
9. destructive 명령(volume 삭제, DB restore, migration reset)은 사용자 명시 승인 없이 실행하지 않는다.
10. 검증하지 못한 항목은 성공으로 표시하지 않고 UNKNOWN으로 보고한다.
```

## 1. 목표 상태

```text
Vercel frontend
  ↓
https://<real-estate-api-domain>
  ↓
AWS EC2 Security Group 443
  ↓
EC2 host Caddy :443
  ↓
127.0.0.1:8080
  ↓
real-estate-backend container
  ├─ mysql container
  └─ redis container

Admin only
  ↓
Tailscale
  ↓
Uptime Kuma :3001
```

## 2. 이관 후 유지할 결정

| 항목 | 결정 |
|---|---|
| Frontend | Vercel 유지 |
| Backend | EC2 Docker Compose |
| Reverse proxy | EC2 host Caddy |
| TLS | Caddy 자동 Let's Encrypt |
| DB | 1차 이관은 MySQL container, 장기적으로 RDS 검토 |
| Redis | 1차 이관은 Redis container, 장기적으로 ElastiCache 검토 |
| Monitoring | Uptime Kuma container |
| Admin access | Tailscale 전용 |
| Public open port | 80, 443만 |
| 금지 | public DB/Redis/backend direct/admin UI |

## 3. AWS 리소스 기준

### 3-1. EC2

권장 시작값:

```text
AMI: Ubuntu 24.04 LTS
Instance: t3.small 이상
Storage: gp3 30GB 이상
Architecture: x86_64 또는 arm64 중 Docker image 호환 기준 선택
```

최소 개발/소규모 운영 시작값:

```text
t3.micro 또는 t4g.micro 가능
단, MySQL + Redis + backend + Uptime Kuma를 한 VM에 띄우므로 메모리 부족 시 t3.small로 올린다.
```

### 3-2. Elastic IP

EC2 public IP가 바뀌지 않게 Elastic IP를 붙인다.

```text
EC2 → Elastic IP 연결
DNS A record → Elastic IP
```

DuckDNS를 계속 쓸 수는 있지만, AWS 운영 이관 후에는 Route 53 또는 Cloudflare DNS 같은 실제 domain 관리를 권장한다.

### 3-3. Security Group

Inbound:

| Port | Source | 용도 |
|---:|---|---|
| 80 | `0.0.0.0/0`, `::/0` | Caddy HTTP challenge/redirect |
| 443 | `0.0.0.0/0`, `::/0` | public HTTPS API |

열지 말 것:

```text
22/tcp public SSH
3001/tcp Uptime Kuma
8080/tcp backend direct
3306/tcp MySQL
6379/tcp Redis
```

SSH는 Tailscale SSH 또는 Tailscale IP를 통해서만 접근한다.

## 4. EC2 초기 세팅 명령

### 4-1. system update

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg git unzip jq ufw
```

### 4-2. Docker 설치

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

### 4-3. Caddy 설치

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
caddy version
```

### 4-4. Tailscale 설치

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
tailscale status
tailscale ip -4
```

## 5. firewall 기준

EC2 Security Group이 1차 방화벽이고, UFW는 host 내부 2차 방어로 사용한다.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow in on tailscale0
sudo ufw enable
sudo ufw status verbose
```

Uptime Kuma를 Tailscale에서만 접근하려면 public Security Group에는 3001을 열지 않는다.

## 6. repository 배치

```bash
sudo mkdir -p /opt/real-estate
sudo chown -R $USER:$USER /opt/real-estate
git clone <repository-url> /opt/real-estate
cd /opt/real-estate
cp .env.example .env
```

실제 `.env` 값은 서버에서만 작성한다. `.env`를 commit하지 않는다.

## 7. EC2용 Docker Compose 보안 기준

현재 개인 개발 compose는 host port를 열 수 있게 되어 있다. EC2에서는 아래 기준으로 조정해야 한다.

### 7-1. 권장 포트 바인딩

| Service | Host bind | Container port | Public 여부 |
|---|---|---:|---|
| backend | `127.0.0.1:8080` | 8080 | public 금지, Caddy만 접근 |
| mysql | publish하지 않음 또는 `127.0.0.1:3306` | 3306 | public 금지 |
| redis | publish하지 않음 또는 `127.0.0.1:6379` | 6379 | public 금지 |
| uptime-kuma | `0.0.0.0:3001` + UFW tailscale0 only | 3001 | public SG 금지 |

EC2에서 LLM이 compose를 수정할 때는 DB/Redis를 public `0.0.0.0`에 열지 않는다.

권장 override 예시:

```yaml
services:
  mysql:
    ports: []

  redis:
    ports: []

  backend:
    ports:
      - "127.0.0.1:${BACKEND_HOST_PORT:-8080}:8080"

  uptime-kuma:
    ports:
      - "${UPTIME_KUMA_HOST_PORT:-3001}:3001"
```

## 8. EC2 `.env` 기준

```env
PUBLIC_URL=https://<vercel-frontend-domain>
API_BASE_URL=https://<real-estate-api-domain>

MYSQL_DATABASE=real_estate_db
MYSQL_USER=real_estate
MYSQL_PASSWORD=<strong-password>
MYSQL_ROOT_PASSWORD=<strong-root-password>

BACKEND_HOST_PORT=8080
UPTIME_KUMA_HOST_PORT=3001

JWT_SECRET=<at-least-32-characters-random-secret>
APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://<vercel-frontend-domain>

VERCEL_API_BASE_URL=https://<real-estate-api-domain>
```

금지:

```text
JWT_SECRET=local-dev-secret...
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=password
APP_CORS_ALLOWED_ORIGIN_PATTERNS=*
```

## 9. backend build/deploy

현재 backend Dockerfile은 host에서 `bootJar`를 만든 뒤 jar를 image에 복사하는 runtime-only 방식이다.

```bash
cd /opt/real-estate
./backend/gradlew -p backend bootJar
docker compose --env-file .env up -d --build mysql redis backend uptime-kuma
docker compose ps
curl -fsS http://127.0.0.1:8080/api/v1/probe/readiness
```

## 10. Caddy 설정

`/etc/caddy/Caddyfile`:

```caddyfile
<real-estate-api-domain> {
    log {
        output stdout
        format json
    }

    @blocked {
        path /.env* /.git/* /api/actuator/* /actuator/*
    }
    respond @blocked 404

    reverse_proxy 127.0.0.1:8080
}
```

검증/적용:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo systemctl status caddy --no-pager
journalctl -u caddy -f
```

## 11. DNS/TLS 검증

DNS:

```bash
dig <real-estate-api-domain>
curl -I http://<real-estate-api-domain>
```

HTTPS:

```bash
curl -vk https://<real-estate-api-domain>/api/v1/probe/readiness
```

정상 응답:

```text
HTTP 200
success
```

## 12. Vercel 설정

Vercel frontend 환경변수:

```env
API_BASE_URL=https://<real-estate-api-domain>
```

GitHub Actions secret:

```text
VERCEL_API_BASE_URL=https://<real-estate-api-domain>
```

backend CORS:

```env
APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://<vercel-frontend-domain>
```

## 13. Uptime Kuma 설정

접속:

```text
http://<ec2-tailscale-ip>:3001
```

public internet에는 3001을 열지 않는다.

권장 monitor:

| Monitor | URL | 목적 |
|---|---|---|
| backend readiness public | `https://<real-estate-api-domain>/api/v1/probe/readiness` | DNS/Caddy/backend 전체 경로 |
| backend liveness public | `https://<real-estate-api-domain>/api/v1/probe/liveness` | app 생존 확인 |
| Vercel frontend | `https://<vercel-frontend-domain>/login` | frontend 배포 확인 |

EC2에서는 Uptime Kuma가 같은 host에 있어도 WSL/NAT loopback 문제가 없으므로 public domain 감시를 우선 사용한다.

## 14. backup/restore 기준

1차 EC2 단일 VM 운영에서 MySQL container를 쓰면 backup은 필수다.

권장 backup 대상:

```text
MySQL dump
Uptime Kuma volume
.env는 별도 secret manager 또는 안전한 password manager에 보관
```

backup 예시:

```bash
mkdir -p /opt/real-estate/backups
docker exec real-estate-mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' \
  > /opt/real-estate/backups/mysql-$(date +%Y%m%d-%H%M%S).sql
```

운영 전에는 restore 리허설 계획을 반드시 작성한다. backup만 있고 restore 검증이 없으면 production-ready로 보지 않는다.

장기적으로는 RDS + automated backup + snapshot retention으로 전환한다.

## 15. 배포 자동화 기준

초기 EC2 이관 직후에는 backend 자동 CD를 바로 켜지 않는다.

초기 수동 배포:

```bash
cd /opt/real-estate
git pull --ff-only
./backend/gradlew -p backend bootJar
docker compose --env-file .env up -d --build backend
curl -fsS http://127.0.0.1:8080/api/v1/probe/readiness
curl -fsS https://<real-estate-api-domain>/api/v1/probe/readiness
```

자동화 전환 조건:

```text
deploy.sh 존재
rollback 절차 존재
backup 절차 존재
health check 실패 시 중단 기준 존재
GitHub Actions secret 정리 완료
```

## 16. LLM 실행 지침

LLM에게 이 문서를 주고 EC2 이관을 요청할 때 사용할 지시문:

```text
너는 real-estate 프로젝트를 AWS EC2 단일 VM 운영 프리셋으로 이관한다.

먼저 수행할 것:
1. repository 구조와 real-estate 프로젝트 위치를 확인한다.
2. Dockerfile, docker-compose.yml, .env.example, GitHub Actions, Caddy 관련 문서를 확인한다.
3. 현재 frontend가 Vercel 기준인지 확인한다.
4. backend readiness/liveness endpoint를 확인한다.
5. DB/Redis/backend/admin UI public 노출 여부를 확인한다.

반드시 지킬 것:
- Kubernetes, Argo CD, Terraform은 도입하지 않는다.
- package manager, DB 종류, framework를 바꾸지 않는다.
- .env, token, private key, certificate를 출력하거나 commit하지 않는다.
- public open port는 80/443만 허용한다.
- SSH, Uptime Kuma, DB, Redis, backend direct는 public으로 열지 않는다.
- Caddy는 EC2 host systemd service로 관리한다.
- frontend는 Vercel을 유지한다.

구성할 것:
- EC2용 env 기준
- EC2용 compose 보안 바인딩 또는 override
- host Caddyfile
- Uptime Kuma monitor 기준
- Tailscale admin access 기준
- backup/restore runbook
- 수동 deploy/runbook

검증할 것:
- docker compose config
- Caddy validate
- local backend readiness
- public HTTPS readiness
- Uptime Kuma 접근 경로
- Security Group/UFW 기준

보고할 것:
- 변경 파일 목록
- 실행한 검증 명령과 결과
- PASS/FAIL/UNKNOWN 상태표
- 남은 수동 AWS 작업
- secret/credential 수동 설정 항목
```

## 17. EC2 이관 체크리스트

```text
[ ] EC2 Ubuntu VM 생성
[ ] Elastic IP 연결
[ ] domain A record가 Elastic IP를 가리킴
[ ] Security Group inbound 80/443만 public 허용
[ ] public 22/3001/8080/3306/6379 미허용
[ ] Docker 설치
[ ] Caddy 설치
[ ] Tailscale 설치
[ ] repository /opt/real-estate 배치
[ ] .env 서버에서 작성
[ ] weak default password 제거
[ ] backend bootJar 성공
[ ] docker compose config 성공
[ ] MySQL/Redis/backend/Uptime Kuma 실행
[ ] Caddy validate 성공
[ ] Caddy reload 성공
[ ] http://127.0.0.1:8080/api/v1/probe/readiness 성공
[ ] https://<real-estate-api-domain>/api/v1/probe/readiness 성공
[ ] Vercel API_BASE_URL 변경
[ ] backend CORS가 Vercel domain만 허용
[ ] Uptime Kuma Tailscale 접근 성공
[ ] Uptime Kuma monitor 등록
[ ] DB backup 생성 성공
[ ] restore 리허설 계획 작성
[ ] Caddy access log 확인
```

## 18. Go/No-Go 기준

Go:

```text
HTTPS public readiness 성공
Vercel frontend에서 login/API 호출 성공
DB/Redis/backend direct public 차단 확인
Uptime Kuma Tailscale 접근 확인
backup 생성 확인
```

No-Go:

```text
80/443 외 public port 열림
weak default secret 사용
backup 없음
HTTPS 실패
CORS 실패
DB/Redis public 노출
```
