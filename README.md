# Teraleads Dental Assistant 
**Note: AI Help is used while generating this file**

## 🚀 Live Deployment

- **Frontend**: https://dental-assistant-six.vercel.app
- **Backend API**: https://teraleads-backend-prod.up.railway.app
- **AI Service**: https://ai-service-dental.up.railway.app

## 📋 Setup & Run Instructions

### Prerequisites
- Node.js 18+ & npm
- Python 3.9+
- PostgreSQL 14+ or Supabase account
- OpenRouter API key (optional, uses mock responses by default)

### Local Development

1. **Clone the repository and install dependencies**
   ```bash
   git clone <parent-repo-url>
   cd Teraleads
   
   # Backend
   cd backend && npm install && cd ..
   
   # Frontend
   cd frontend && npm install && cd ..
   
   # AI Service
   cd ai-service && pip install -r requirements.txt && cd ..
   ```

2. **Configure environment variables**
   
   Create `.env` files in each subdirectory:
   
   **backend/.env:**
   ```
   PORT=4000
   DATABASE_URL=postgresql://user:password@host:5432/teraleads
   JWT_SECRET=your_jwt_secret
   AI_SERVICE_URL=http://localhost:8000
   AI_SERVICE_TIMEOUT_MS=15000
   CORS_ORIGINS=http://localhost:5173
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```
   
   **frontend/.env:**
   ```
   VITE_API_URL=http://localhost:4000
   ```
   
   **ai-service/.env:**
   ```
   PORT=8000
   OPENROUTER_API_KEY=your_api_key
   OPENROUTER_MODEL=openai/gpt-4o-mini
   OPENROUTER_SITE_URL=http://localhost:5173
   OPENROUTER_APP_NAME=Teraleads Dental Assistant
   ```

3. **Run services**
   ```bash
   # Backend (from backend/ directory)
   npm start
   
   # Frontend (from frontend/ directory)
   npm run dev
   
   # AI Service (from ai-service/ directory)
   python app.py
   ```

## 🏗️ Architecture Overview

**Frontend (React + Vite)**
- Patient list management with CRUD operations
- Real-time chat interface with AI assistant
- JWT-based authentication
- Responsive UI with modern styling

**Backend (Node.js + Express)**
- RESTful API with authentication (JWT)
- Patient and chat message endpoints
- Database integration with connection pooling
- CORS-configured for multi-origin support
- Health checks and error handling

**Database (PostgreSQL/Supabase)**
- Patient profiles, authentication records, chat history
- Automatic timestamp triggers (created_at, updated_at)
- Normalized schema with proper indexing

**AI Service (Python + Flask)**
- Mock dental knowledge base (no external API required)
- Intelligent topic-based response routing
- Fallback responses for unknown queries
- Production-ready error handling

## 🛠️ Environment Variables Summary

| Service | Variable## 📝 License

MIT
 | Purpose |
|---------|----------|---------|
| Backend | `DATABASE_URL` | PostgreSQL connection string |
| Backend | `JWT_SECRET` | Token signing secret |
| Backend | `AI_SERVICE_URL` | AI service endpoint |
| Frontend | `VITE_API_URL` | Backend API endpoint |
| AI | `OPENROUTER_API_KEY` | Optional external LLM API |

## 🤖 AI Usage Disclosure

**AI-Assisted Components:**
- CSS styling and responsive design
- HTML markup and component structure
- Data seeding and mock responses
- UI/UX component boilerplate
- Documentation formatting

**Manual Implementation (100% Human-Built):**
- Database schema design and migrations
- Application architecture and API design
- Authentication flow (JWT implementation)
- State management and hook logic
- Event-based triggering and real-time updates
- Error handling and validation logic
- Production deployments (Vercel, Railway, Supabase)
- Integration testing and debugging
- CORS configuration and security headers
- Database connection pooling and SSL handling

The core business logic, data models, authentication, and deployment infrastructure were entirely built and configured manually. AI was leveraged only for accelerating static UI/styling work, allowing focus on robust backend architecture and secure deployments.

## 📦 Project Structure

```
Teraleads/
├── frontend/          # React SPA
├── backend/           # Express.js API
├── ai-service/        # Python Flask service
└── README.md          # This file
```

## 🔧 Deployment Notes

- **Frontend**: Deployed on Vercel with automatic deployments from `master` branch
- **Backend**: Deployed on Railway with PostgreSQL (Supabase Pooler)
- **AI Service**: Deployed on Railway as containerized Python service

