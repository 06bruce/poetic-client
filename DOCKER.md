# Docker Compose for Poem Studio

## Services

### poem-studio (Production)
- **Build:** Multi-stage Dockerfile (node:18-alpine)
- **Port:** 3000
- **Uses:** `serve` to run the built React app
- **Health checks:** Enabled

### nginx (Optional reverse proxy)
- **Port:** 80 (exposed to localhost)
- **Upstream:** poem-studio:3000
- **Features:**
  - Gzip compression
  - Security headers (X-Frame-Options, CSP-aware)
  - Long cache for static assets
  - SPA routing (all paths → index.html)

### Dockerfile.dev
- **Port:** 5173 (Vite dev server)
- **Purpose:** Local development with hot reload
- **Usage:** Add to docker-compose.yml if desired

## Quick Start

### Production build
```bash
docker-compose up --build
```

Visit `http://localhost:3000` (direct) or `http://localhost` (via Nginx)

### Development build
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Then add this to `docker-compose.dev.yml`:
```yaml
services:
  poem-studio-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_HOST=0.0.0.0
```

### View logs
```bash
docker-compose logs -f poem-studio
```

### Stop & clean
```bash
docker-compose down
docker-compose down --volumes  # Remove all data
```

## Notes

- Images use `node:18-alpine` for small size (~160MB)
- Health checks ensure containers are running properly
- Nginx is optional—remove if running directly on port 3000
- Build time: ~2-3 min on first build, <30s on cache hits
