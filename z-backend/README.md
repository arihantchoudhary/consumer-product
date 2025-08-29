# Consumer Product Backend API

A well-organized FastAPI backend for managing AI agents and conversations.

## Features

- ✅ RESTful API for agent management
- ✅ ElevenLabs integration for AI voice agents
- ✅ In-memory storage with file persistence
- ✅ Modular architecture with routers, services, and models
- ✅ CORS support for frontend integration
- ✅ Health check endpoints
- ✅ Structured logging

## Architecture

```
z-backend/
├── app/
│   ├── main.py           # FastAPI application setup
│   ├── routers/          # API route handlers
│   │   ├── agents.py     # Agent CRUD operations
│   │   ├── auth.py       # Authentication helpers
│   │   └── conversations.py # Conversation endpoints
│   ├── models/           # Pydantic models
│   │   ├── agent.py      # Agent data models
│   │   ├── conversation.py # Conversation models
│   │   └── user.py       # User models
│   ├── services/         # External service integrations
│   │   └── elevenlabs.py # ElevenLabs API client
│   └── storage/          # Data persistence layer
│       └── memory_store.py # In-memory storage with file backup
├── data/                 # JSON data files (auto-created)
├── run.py               # Application entry point
├── requirements.txt      # Python dependencies
└── .env.example         # Environment variables template
```

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and add your API keys:
   ```bash
   cp .env.example .env
   ```

3. Run the server:
   ```bash
   python run.py
   ```

   Or with uvicorn directly:
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```

## API Endpoints

### Health Check
- `GET /` - API info
- `GET /health` - Health status

### Agents
- `POST /api/agents/create` - Create a new agent
- `GET /api/agents/list` - List user's agents
- `DELETE /api/agents/{agent_id}` - Delete an agent

### Conversations
- `GET /api/agents/conversations` - Get conversations for user's agents

## Authentication

Currently uses a simple header-based auth (`X-User-Id`). In development mode, it defaults to a test user if no header is provided.

## Storage

The API uses an in-memory store with JSON file persistence:
- User data: `./data/users.json`
- Agent data: `./data/agents.json`
- User-agent mappings: `./data/user_agents.json`

This can be easily replaced with a proper database (PostgreSQL, MongoDB, etc.) by implementing the same interface.

## API Documentation

When the server is running, visit:
- Interactive API docs: http://localhost:8001/docs
- Alternative API docs: http://localhost:8001/redoc

## Future Enhancements

- [ ] Proper authentication (JWT/OAuth)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Rate limiting
- [ ] Request validation middleware
- [ ] Background task queue
- [ ] WebSocket support for real-time updates
- [ ] File upload support
- [ ] API versioning
- [ ] Comprehensive test suite