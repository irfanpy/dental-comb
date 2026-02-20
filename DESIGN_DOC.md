# Teraleads Dental Assistant Dashboard – System Design Document
## Note: AI Help is used while generating this file
## 1. Schema Design & Indexing Strategy

### Core Entities

**users** (`users` table)
```
id: UUID (primary key)
email: VARCHAR(255, unique, not null)
password_hash: VARCHAR(255, not null)
created_at: TIMESTAMP (default: now())
```

**patients** (`patients` table)
```
id: UUID (primary key)
user_id: UUID (foreign key → users.id, not null)
name: VARCHAR(255, not null)
email: VARCHAR(255)
phone: VARCHAR(20)
date_of_birth: DATE
medical_notes: TEXT
created_at: TIMESTAMP (default: now())
updated_at: TIMESTAMP (auto-trigger on update)
```

**chat_messages** (`chats` table)
```
id: UUID (primary key)
user_id: UUID (foreign key → users.id, not null)
patient_id: UUID (foreign key → patients.id, not null)
role: VARCHAR(10) /* 'user' or 'assistant' */
message: TEXT (not null)
created_at: TIMESTAMP (default: now())
```

### Indexing Strategy

| Index Name | Columns | Rationale |
|------------|---------|-----------|
| `idx_patients_user_id` | `(user_id)` | List patients by tenant for pagination |
| `idx_chats_patient_id` | `(patient_id)` | Retrieve chat history for a patient |
| `idx_chats_user_patient` | `(user_id, patient_id, created_at DESC)` | Composite query for chat timeline |
| `idx_users_email` | `(email)` | Fast login lookup |

**Design Rationale:**
- **UUIDs** avoid sequential ID predictability and simplify multi-region deployments.
- **Multi-tenant isolation** via `user_id` ensures data segmentation at the application layer.
- **Composite indexes** on `(user_id, patient_id)` optimize filtering and sorting by creation time.
- **Automatic triggers** on `updated_at` maintain audit trails for patient record changes.

---

## 2. Authentication & Security Design

### JWT-Based Authentication
- **Token Generation**: On login, backend signs JWT with `JWT_SECRET` (HS256).
- **Token Payload**: Includes `userId`, `email`, `iat`, `exp` (7-day expiry).
- **Validation**: All protected routes verify JWT signature and expiry via middleware.
- **Storage**: Frontend stores token in memory (or secure HttpOnly cookie) to prevent XSS.

### Password Security
- **Hashing**: bcryptjs with 10 salt rounds; never store plaintext passwords.
- **Validation**: Minimum 8 characters enforced at registration; Zod schema validation.
- **Reset Flow**: Future feature would use time-limited tokens sent via email.

### Data Isolation & Authorization
- **Scoping**: All patient and chat queries filter by authenticated `user_id` at the database level.
- **Cross-Tenant Prevention**: Middleware verifies ownership before allowing read/write operations.
- **Input Sanitization**: Zod validation schemas reject malformed or malicious payloads with 400 responses.

### Additional Security Measures
- **CORS Allowlist**: Backend only accepts requests from whitelisted origins (Vercel frontend, localhost).
- **Rate Limiting**: Future implementation on `/auth/login` and `/chat` endpoints to prevent brute force.
- **HTTPS Enforcement**: Production deployments use TLS; Vercel and Railway enforce HTTPS by default.
- **SQL Injection Prevention**: Use parameterized queries via pg Pool; avoid string concatenation.

---

## 3. AI Service Architecture

### Microservice Design
- **Technology**: Python 3 + Flask on a separate Railway container.
- **Endpoints**:
  - `GET /health` – Returns `{"status": "ok"}` for liveness probes.
  - `POST /generate` – Accepts `{"message": string, "patient": {name?: string}}`, returns `{"reply": string, "source": "mock|openrouter"}`.

### Response Generation Strategy
1. **Mock Knowledge Base** (Default): Pre-defined responses for dental topics (root canal, cavity, cleaning, etc.) matched via keyword search.
2. **Fallback Responses**: Generic dental recommendations if no topic match or API failure.
3. **Optional OpenRouter Integration**: Environment-based switch to call OpenAI-compatible API if `OPENROUTER_API_KEY` is set.

### Backend Integration
- **Timeout Handling**: Backend enforces 15-second timeout on AI requests to prevent hanging.
- **Async Considerations**: Future optimization with job queues (Redis/Bull) for long-running AI calls.
- **Error Resilience**: Graceful degradation returns default reply instead of failing user requests.

---

## 4. Scaling Considerations & Trade-Offs

### Database Scaling
| Strategy | Pros | Cons |
|----------|------|------|
| **Read Replicas** | Distribute read-heavy chat queries | Replication lag, increased operational cost |
| **Partitioning by user_id** | Scale horizontally; improve hot-spot performance | Complex migrations; cross-partition joins slower |
| **Caching Layer (Redis)** | Reduce DB load for chat history | Additional infrastructure; staleness risk |

**Recommended Path**: Start with indexed queries + pagination; add read replicas at 100M+ chat records.

### Backend Scaling
- **Load Balancer**: Use Railway's built-in or AWS ALB to distribute traffic across multiple instances.
- **Secrets Management**: Move `JWT_SECRET` and `AI_SERVICE_URL` to Railway's managed secrets, not `.env`.
- **Horizontal Scaling**: Stateless design allows unlimited replicas; each instance connects to a shared database pool.

### AI Service Scaling
| Approach | Pros | Cons |
|----------|------|------|
| **Sync (Current)** | Simple; low latency for typical calls | Blocks requests during AI generation |
| **Async Queue** | Non-blocking; handle burst traffic | Added latency; infrastructure overhead (Redis/Bull) |
| **Response Caching** | Reduce API calls; faster repeated questions | Outdated responses; memory overhead |

**Trade-Off**: Sync approach is sufficient for dental clinic scale (100–1000 patients); upgrade to async if response times exceed 5 seconds.

### Security & Observability
- **Logging**: Structured JSON logs with request ID, user ID, and AI source for auditing.
- **Metrics**: Track token validation failures, chat latency, AI service uptime.
- **Audit Trail**: Log all patient record access and modifications for compliance.

### Cost Optimization
- **Serverless Option**: Migrate to AWS Lambda + RDS for variable workloads (lower cost if idle periods).
- **CDN for Frontend**: Vercel auto-caches static assets; no additional setup needed.
- **Database Pooling**: Supabase Pooler reduces connection overhead; essential for serverless backends.

---
