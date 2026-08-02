# Production-Grade Authentication Service

> A scalable, secure authentication platform built with **Node.js, Express, TypeScript, PostgreSQL, Redis, Docker, Kubernetes, and Next.js**.

---

# 1. Project Goal

This project is **not just a login system**.

It is designed to be an independent Authentication Platform that any application can use.

Examples:

- Next.js Web App
- React SPA
- React Native
- Flutter
- Mobile APIs
- Other Backend Services

The Authentication Service exposes REST APIs that any client can consume.

---

# 2. High-Level Architecture

```text
                         Internet
                             │
                             │
                     HTTPS / TLS
                             │
                    Nginx / Ingress
                             │
              ┌──────────────┴──────────────┐
              │                             │
              │      Auth Service API       │
              │  Node.js + Express + TS     │
              │                             │
              └──────────────┬──────────────┘
                             │
        ┌────────────────────┼─────────────────────┐
        │                    │                     │
        │                    │                     │
 PostgreSQL              Redis              Email Provider
 (Persistent)         (Cache, OTP,         (SMTP/Resend)
                       Rate Limits)
                             │
                             │
                      OAuth Providers
          Google • GitHub • Facebook
```

---

# 3. Overall Architecture

The project follows **Clean Architecture** principles.

```text
                Client
                   │
                   ▼
             Express Routes
                   │
                   ▼
             Controllers
                   │
                   ▼
              Services
                   │
                   ▼
           Repositories
                   │
                   ▼
             PostgreSQL
```

Responsibilities

| Layer        | Responsibility                        |
| ------------ | ------------------------------------- |
| Routes       | Define API endpoints                  |
| Controllers  | Receive requests and return responses |
| Services     | Business logic                        |
| Repositories | Database access                       |
| Database     | Persistent storage                    |

---

# 4. Backend Folder Structure

```text
src/

├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.repository.ts
│   ├── auth.routes.ts
│   └── auth.validation.ts
│
├── users/
│
├── oauth/
│   ├── google/
│   ├── github/
│   └── facebook/
│
├── email/
│
├── sessions/
│
├── middleware/
│
├── config/
│
├── database/
│
├── shared/
│
├── utils/
│
├── types/
│
└── app.ts
```

---

# 5. Technology Stack

## Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- Redis
- Argon2
- jose
- Zod
- Pino

## Frontend

- Next.js
- TailwindCSS
- React Hook Form
- TanStack Query

## Infrastructure

- Docker
- Docker Compose
- Kubernetes
- Nginx
- GitHub Actions

---

# 6. Authentication Flow

## Register

```text
User

↓

POST /auth/register

↓

Validate Request

↓

Check Email Exists

↓

Hash Password

↓

Create User

↓

Generate Verification Token

↓

Send Verification Email

↓

Return Success
```

---

## Verify Email

```text
User Clicks Email Link

↓

GET /auth/verify

↓

Validate Token

↓

Mark Email Verified

↓

Delete Verification Token
```

---

## Login

```text
POST /auth/login

↓

Validate Input

↓

Find User

↓

Verify Password

↓

Generate Access Token

↓

Generate Refresh Token

↓

Store Refresh Token Hash

↓

Return Tokens
```

---

## Refresh Token

```text
Refresh Token

↓

Verify Signature

↓

Compare Hash

↓

Rotate Refresh Token

↓

Generate New Access Token

↓

Return Tokens
```

---

## Logout

```text
Refresh Token

↓

Delete Stored Token

↓

Clear Cookie

↓

Done
```

---

## Google Login

```text
Client

↓

Google OAuth

↓

Authorization Code

↓

Backend Callback

↓

Exchange Code

↓

Verify ID Token

↓

Find User

↓

Create User (if necessary)

↓

Issue JWT

↓

Done
```

---

# 7. JWT Strategy

## Access Token

Purpose

- Authenticate API requests

Expiration

15 minutes

Contains

```json
{
  "sub": "userId",
  "email": "user@email.com",
  "role": "user"
}
```

---

## Refresh Token

Purpose

Issue new access tokens.

Expiration

30 days

Stored

- HttpOnly Cookie
- Hashed inside PostgreSQL

---

# 8. OAuth Strategy

Supported Providers

- Google
- GitHub
- Facebook

Flow

```text
User

↓

OAuth Provider

↓

Authorization Code

↓

Backend

↓

Provider Token Endpoint

↓

User Profile

↓

Create/Login User

↓

Issue JWT
```

---

# 9. Database Design

## users

```text
id UUID PK

email UNIQUE

password_hash

display_name

avatar

is_email_verified

created_at

updated_at
```

---

## oauth_accounts

```text
id UUID PK

user_id FK

provider

provider_user_id

provider_email

created_at
```

Allows one user to connect multiple providers.

Example

```text
Google

GitHub

Facebook
```

All linked to one account.

---

## refresh_tokens

```text
id UUID PK

user_id FK

token_hash

expires_at

revoked_at

device

ip_address

created_at
```

Only hashes are stored.

---

## email_verification_tokens

```text
id UUID

user_id

token_hash

expires_at
```

---

## password_reset_tokens

```text
id UUID

user_id

token_hash

expires_at
```

---

## audit_logs

```text
id

user_id

action

ip_address

user_agent

created_at
```

Example actions

- LOGIN
- LOGOUT
- PASSWORD_CHANGED
- EMAIL_VERIFIED
- ACCOUNT_LINKED

---

# 10. Entity Relationship Diagram

```text
Users
│
├──────────────┐
│              │
│              │
▼              ▼

OAuth      Refresh Tokens

Accounts

│

▼

Password Reset Tokens

│

▼

Verification Tokens
```

---

# 11. Redis Usage

Redis is used for temporary data.

Examples

## Rate Limiting

```text
IP

↓

Login Attempts

↓

Blocked after 5 attempts
```

---

## OTP Storage

```text
Email

↓

OTP

↓

Expires in 5 minutes
```

---

## Session Cache

Frequently accessed user sessions.

---

## Blacklisted JWTs (optional)

Immediately invalidate tokens after logout.

---

# 12. Security Design

Passwords

- Argon2 hashing

Authentication

- JWT Access Tokens

Authorization

- Role Based Access Control

Validation

- Zod

Security Headers

- Helmet

Rate Limiting

- Redis

CORS

- Configurable

Cookies

- HttpOnly
- Secure
- SameSite

---

# 13. API Endpoints

## Authentication

```text
POST   /auth/register

POST   /auth/login

POST   /auth/logout

POST   /auth/refresh

GET    /auth/me
```

---

## Email

```text
POST /auth/verify-email

POST /auth/resend-verification

POST /auth/forgot-password

POST /auth/reset-password
```

---

## OAuth

```text
GET /auth/google

GET /auth/google/callback

GET /auth/github

GET /auth/github/callback

GET /auth/facebook

GET /auth/facebook/callback
```

---

# 14. Frontend Architecture

```text
app/

components/

hooks/

lib/

services/

types/

middleware.ts
```

---

## Frontend Flow

```text
Login Page

↓

Submit Form

↓

POST /auth/login

↓

Store Access Token (memory)

↓

Refresh Token (HttpOnly Cookie)

↓

Authenticated User

↓

Protected Dashboard
```

---

# 15. Deployment Architecture

```text
                Internet
                    │
             Load Balancer
                    │
             Kubernetes Ingress
                    │
        ┌───────────┴───────────┐
        │                       │
        │                       │
   Auth Service Pod      Auth Service Pod
        │                       │
        └───────────┬───────────┘
                    │
              PostgreSQL
                    │
                 Redis
```

---

# 16. Docker Structure

```text
docker/

Dockerfile

docker-compose.yml

.env

.env.production
```

---

# 17. Kubernetes

```text
k8s/

namespace.yaml

deployment.yaml

service.yaml

ingress.yaml

postgres.yaml

redis.yaml

configmap.yaml

secret.yaml

hpa.yaml
```

---

# 18. Logging

Every request gets a Request ID.

Example

```text
Incoming Request

↓

Authentication

↓

Business Logic

↓

Database

↓

Response

↓

Log Written
```

Example log

```json
{
  "requestId": "123",
  "userId": "42",
  "method": "POST",
  "endpoint": "/auth/login",
  "status": 200,
  "duration": "45ms"
}
```

---

# 19. Future Improvements

- Multi-Factor Authentication (TOTP)
- Passkeys (WebAuthn)
- Apple Login
- Microsoft Login
- Discord Login
- LinkedIn Login
- Organization Accounts
- Role-Based Access Control (RBAC)
- Permissions System
- API Keys
- Audit Dashboard
- Session Management UI
- Admin Portal
- OpenAPI / Swagger Documentation
- Prometheus Metrics
- Grafana Dashboards
- OpenTelemetry Tracing

---

# 20. Learning Objectives

This project demonstrates knowledge of:

- Backend API Design
- Authentication & Authorization
- OAuth 2.0 / OpenID Connect
- JWT Authentication
- Secure Password Storage
- PostgreSQL Schema Design
- Redis Caching
- Docker
- Kubernetes
- Clean Architecture
- Repository Pattern
- Dependency Injection
- REST API Design
- CI/CD Pipelines
- Logging & Monitoring
- Production Security Best Practices

---

# 21. Resume Description

**Production-Grade Authentication Platform**

Designed and developed a reusable authentication platform using Node.js, Express, TypeScript, PostgreSQL, Redis, and Next.js. Implemented secure email/password authentication, OAuth (Google, GitHub, Facebook), JWT access/refresh token rotation, email verification, password recovery, session management, and account linking. Containerized the application with Docker and deployed it on Kubernetes using scalable infrastructure, health checks, structured logging, and production-ready security practices.
