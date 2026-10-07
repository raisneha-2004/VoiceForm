# VoiceForm REST API 🎙️⚡

Production-grade, secure, scalable REST API for **VoiceForm** — an AI-powered multilingual conversational form-filling platform.

---

## Architecture Overview

```
server/
├── src/
│   ├── config/              # Validated environment, MongoDB, logger, Swagger
│   ├── controllers/         # Thin HTTP request handlers
│   ├── routes/              # Express route definitions with validation & RBAC
│   ├── models/              # Mongoose schemas (User, FormTemplate, FormSubmission, AuditLog)
│   ├── services/            # Core business logic & external integrations
│   │   ├── ai/              # AI Provider abstraction (Gemini, OpenAI, Mock)
│   │   ├── auth.service.ts
│   │   ├── template.service.ts
│   │   ├── submission.service.ts
│   │   ├── voice.service.ts
│   │   ├── pdf.service.ts
│   │   └── ruleExtractor.service.ts
│   ├── middleware/          # JWT, RBAC, Zod validation, rate limiting, sanitization, errors
│   ├── validators/          # Zod validation schemas
│   ├── utils/               # ApiResponse, ApiError, FieldValidator, Sanitizer
│   ├── types/               # Shared TypeScript types & domain models
│   ├── seeds/               # Database seeder with 4 default templates
│   ├── app.ts               # Express application builder
│   └── server.ts            # Server bootstrap & graceful shutdown
└── tests/                   # Vitest + Supertest integration & unit test suite
```

---

## Tech Stack

- **Runtime**: Node.js v20+ with TypeScript (ES Modules, strict mode)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (short-lived access tokens + rotating refresh tokens), bcryptjs (salt rounds = 12)
- **Validation**: Zod (strict request & schema validation)
- **AI / NLP**: Swappable provider abstraction (Google Gemini 1.5 Flash, OpenAI GPT-4o-mini, Mock/Local Rule Engine)
- **Document Generation**: PDFKit (branded high-resolution PDF generation)
- **API Documentation**: OpenAPI 3.0 + Swagger UI (`/api/docs`)
- **Security**: Helmet, CORS, express-rate-limit, NoSQL injection sanitization, request tracing, sensitive field masking
- **Testing**: Vitest + Supertest + In-Memory MongoDB

---

## Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/voiceform` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens | (random string >= 16 chars) |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | (random string >= 16 chars) |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifespan | `15m` |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token lifespan | `7d` |
| `AI_PROVIDER` | Active AI provider (`mock`, `gemini`, `openai`) | `mock` |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | |
| `OPENAI_API_KEY` | OpenAI API key (optional) | |
| `RATE_LIMIT_MAX_REQUESTS` | Global requests per 15 min | `200` |
| `AUTH_RATE_LIMIT_MAX` | Auth attempts per 15 min | `10` |
| `VOICE_RATE_LIMIT_MAX` | Voice processing reqs per min | `60` |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Seeds the default Admin account (`admin@voiceform.com` / `AdminPassword123!`) and 4 pre-configured templates:
- Student Registration Form
- Job Application Form
- Contact & Support Inquiry Form
- Hackathon & Tech Conference Registration

```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.
Explore the interactive **Swagger UI** documentation at `http://localhost:5000/api/docs`.

### 4. Build for Production
```bash
npm run build
npm start
```

### 5. Run Test Suite
```bash
npm test
```

---

## Database Schemas

### 1. User
- `name`: Full name
- `email`: Unique, lowercase, indexed
- `passwordHash`: Bcrypt-hashed password (excluded from default queries)
- `role`: `'user' | 'admin'`
- `avatar`: URL string
- `preferences`: `{ preferredLanguage, autoSpeakQuestions, confirmSensitiveFields, speechRate, speechPitch, theme }`
- `refreshTokens`: Array of `{ tokenHash, expiresAt, userAgent, ip, createdAt }`
- `timestamps`: `createdAt`, `updatedAt`

### 2. FormTemplate & FormField
- `title`, `slug`, `description`, `category`, `status` (`draft` | `published` | `archived`), `icon`, `estimatedMinutes`, `createdBy`
- Nested `fields`:
  - `id`, `key`, `label`, `type` (`text`, `textarea`, `number`, `email`, `phone`, `date`, `select`, `checkbox`, `radio`, `file`)
  - `placeholder`, `required`, `helpText`, `isSensitive` (boolean)
  - `options`: `[{ label, value }]`
  - `conditional`: `{ dependsOnKey, condition, value }`
  - `validation`: `{ min, max, pattern, customErrorMessage }`
  - `order`: Numeric sort position

### 3. FormSubmission
- `userId`: Reference to User
- `templateId`: Reference to FormTemplate
- `title`: Submission name
- `values`: Key-value map of submitted form data
- `fieldStatus`: Map of validation status (`valid`, `invalid`, `pending_confirmation`)
- `status`: `'draft' | 'in_progress' | 'completed' | 'submitted'`
- `completionPercentage`: Auto-calculated (0-100%) based on applicable required fields
- `voiceMetrics`: `{ commandsUsed, correctionsCount, voiceInputCount }`
- `isDeleted`: Soft deletion flag
- `submittedAt`: Locked submission timestamp

### 4. AuditLog
- `userId`, `submissionId`, `templateId`
- `action`: `CREATE`, `UPDATE_VALUE`, `VOICE_PROCESS`, `CONFIRM_SENSITIVE`, `SUBMIT`, `REOPEN`, `DELETE`
- `changedFields`: `[{ fieldKey, oldValue, newValue, isSensitive }]`
  *(Sensitive fields are masked as `***MASKED***`)*
- `source`: `'voice' | 'text' | 'system'`
- `ip`, `userAgent`, `timestamp`

---

## REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT access & refresh tokens | Public |
| `POST` | `/api/auth/refresh` | Rotate refresh token and obtain new access token | Public |
| `POST` | `/api/auth/logout` | Invalidate active refresh token session | Public |
| `POST` | `/api/auth/forgot-password`| Request password reset token | Public |
| `POST` | `/api/auth/reset-password` | Set new password using reset token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & preferences | Authenticated |
| `PATCH`| `/api/auth/me` | Update personal profile or voice preferences | Authenticated |

### Form Templates (`/api/templates`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/templates` | List published templates (filterable by category/search) | Public |
| `GET` | `/api/templates/:id` | Fetch template details and field definitions | Public |
| `POST` | `/api/templates` | Create a new template with fields and conditional rules | Admin only |
| `PATCH`| `/api/templates/:id` | Modify template metadata or fields | Admin only |
| `DELETE`| `/api/templates/:id` | Delete or archive template | Admin only |
| `PATCH`| `/api/templates/:id/publish` | Toggle template status between `draft` and `published` | Admin only |

### Submissions (`/api/submissions`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/submissions` | List user's submissions (supports pagination & status) | Authenticated |
| `POST` | `/api/submissions` | Create a new submission draft | Authenticated |
| `GET` | `/api/submissions/:id` | Retrieve submission data with completion % | Owner / Admin |
| `PATCH`| `/api/submissions/:id` | Update form values (blocked once submitted) | Owner / Admin |
| `DELETE`| `/api/submissions/:id` | Soft delete submission | Owner / Admin |
| `POST` | `/api/submissions/:id/duplicate` | Clone existing submission into a new draft | Owner / Admin |
| `POST` | `/api/submissions/:id/submit` | Validate all required fields and lock as `submitted` | Owner / Admin |
| `GET` | `/api/submissions/:id/pdf` | Stream downloadable formatted PDF report | Owner / Admin |

### Voice & AI Processing (`/api/voice`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/voice/process` | Process spoken transcript, extract values & commands | Authenticated |
| `POST` | `/api/voice/confirm-sensitive` | Explicitly confirm and persist a sensitive field | Authenticated |
| `POST` | `/api/voice/review` | Generate conversational audit of filled vs missing fields | Authenticated |
| `POST` | `/api/voice/command` | Execute direct navigation or action voice commands | Authenticated |

---

## AI & Natural Language Processing Engine

### 1. Hybrid Processing Pipeline
1. **Deterministic Rule Extractor First**:
   - Email regex matching (`sneha.rai@example.com` or `"sneha at gmail dot com"`).
   - Indian mobile & international phone format detection (`+91 9876543210`).
   - Age / numeric detection (`"I am 21 years old"`).
   - Direct field correction syntax (`"Change my city to Delhi"`, `"My age is 22, not 21"`).
   - Control commands (`"Clear email"`, `"Next field"`, `"Review my form"`, `"Submit form"`).
2. **AI Provider Fallback**:
   - Sends strictly typed schema to OpenAI or Gemini with structured JSON output requirements.
   - Gracefully degrades to local rule engine if API key is not configured or upstream API fails.
3. **Strict Pre-Persistence Validation**:
   - AI outputs are never trusted blindly. Each extracted field is validated against field type, min/max length, numeric bounds, and select options before saving.
4. **Sensitive Field Gatekeeper**:
   - When a field is marked `isSensitive: true` and the user has `confirmSensitiveFields: true`, the value is put in `pending_confirmation` until confirmed via `/api/voice/confirm-sensitive`.

---

## Example API Workflows

### 1. Multi-Field Natural Language Input
**Request**:
```http
POST /api/voice/process HTTP/1.1
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "submissionId": "65f8a123...",
  "templateId": "65f8b456...",
  "transcript": "My name is Sneha Rai, I am 21 years old, my email is sneharai@gmail.com and I live in Noida",
  "language": "en-IN"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "intent": "field_update",
    "updates": [
      { "fieldKey": "fullName", "value": "Sneha Rai", "confidence": 0.94, "requiresConfirmation": false },
      { "fieldKey": "dob", "value": "2005-01-01", "confidence": 0.95, "requiresConfirmation": false },
      { "fieldKey": "email", "value": "sneharai@gmail.com", "confidence": 0.98, "requiresConfirmation": true },
      { "fieldKey": "city", "value": "Noida", "confidence": 0.92, "requiresConfirmation": false }
    ],
    "commands": [],
    "validationErrors": [],
    "assistantMessage": "I updated your Full Legal Name, Residential City. Because Email Address is sensitive, please confirm to save.",
    "nextQuestion": "Please share your mobile or contact number."
  }
}
```

### 2. Correction Command
**Request**:
```http
POST /api/voice/process HTTP/1.1
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "submissionId": "65f8a123...",
  "templateId": "65f8b456...",
  "transcript": "Change my city to Delhi"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "intent": "field_update",
    "updates": [
      { "fieldKey": "city", "value": "Delhi", "confidence": 0.95, "requiresConfirmation": false }
    ],
    "assistantMessage": "I updated your Current Residential City."
  }
}
```

---

## Security Best Practices Implemented

- **Password Hashing**: Bcrypt with work factor of 12.
- **Token Security**: Short-lived JWT access tokens (15m) + cryptographic random refresh tokens stored as SHA-256 hashes in MongoDB.
- **Refresh Token Rotation**: Old refresh tokens are invalidated on every refresh attempt.
- **RBAC**: Strict role enforcement (`admin` required for template mutations).
- **Sanitization**: Deep recursive stripping of MongoDB operators (`$` and `.`) on all incoming request bodies and parameters.
- **Sensitive Masking**: Password hashes, tokens, and PII are redacted from structured logs and audit records.
- **Rate Limiting**: Tiered rate limits for auth, voice processing, and general endpoints.
- **Standardized Errors**: Centralized error middleware ensuring no internal stack traces or secrets leak in production.
