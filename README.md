# Docker Compose Book Store Application

This is a fully dockerized MERN stack book store application with MongoDB, Express backend, and React frontend.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set secure values for:

   - MONGO_USER
   - MONGO_PASSWORD
   - JWT_SECRET

2. Build and start the application:

   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Services

- **Frontend**: React/Vite application served by Nginx
- **Backend**: Node.js/Express API
- **MongoDB**: Database with persistent storage

## Development

To run the stack in development mode with hot-reload:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Environment Variables

Key environment variables (see `.env.example` for all options):

- `MONGO_USER`: MongoDB username
- `MONGO_PASSWORD`: MongoDB password
- `JWT_SECRET`: Secret for JWT token generation
- `VITE_API_URL`: Backend API URL for frontend

## Data Persistence

MongoDB data is persisted in a named volume `mongodb_data`. To reset the database:

```bash
docker compose down -v
```

## Health Checks

- Backend has built-in health check at `/api/books`
- MongoDB uses default health check
- Frontend served by Nginx with proper error page handling

## Troubleshooting

1. If services won't start, check logs:

   ```bash
   docker compose logs [service_name]
   ```

2. To reset everything and start fresh:
   ```bash
   docker compose down -v
   docker compose up --build
   ```
