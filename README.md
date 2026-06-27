# POKIDEX

> A full-stack Pokémon encyclopedia built with Next.js 16, Express 5, PostgreSQL, and Redis — covering all generations with real-time search, detailed stat views, and type/move data sourced from PokéAPI.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Container Deployment (Podman)](#container-deployment-podman)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

POKIDEX is a full-stack Pokémon reference application that exposes a custom REST API backed by a seeded PostgreSQL database populated from the [PokéAPI](https://pokeapi.co/). The frontend is a Next.js 16 application using the App Router, with server-side rendering for individual Pokémon pages and a fully client-side interactive Pokédex browser with filtering, search, and a detail modal.

Key capabilities:

- Browse and filter all Pokémon by generation, type, legendary status, or mythical status
- Full-text search by name, slug, or national dex number
- Detailed Pokémon pages with base stats, moves, flavor texts, abilities, and evolution chains
- Type explorer with strength/weakness matchup data
- Generation browser with regional metadata and game coverage
- Side-by-side Pokémon comparison via query parameters
- Legandaries and Mythicals endpoint for filtered access
- Redis-backed caching on the data layer
- Podman-first containerized deployment with a `systemd` user service for cloud VMs

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
└─────────────────────────┬────────────────────────────────┘
                          │  HTTPS
┌─────────────────────────▼────────────────────────────────┐
│               Next.js 16 Frontend (Port 3000)            │
│  App Router · SSR Pages · Client Components · Tailwind   │
│                                                          │
│  /api/* rewrites  ──────────────────────────────────────►│
└─────────────────────────┬────────────────────────────────┘
                          │  HTTP (Proxy via next.config)
┌─────────────────────────▼────────────────────────────────┐
│           Express 5 Backend (Port 4000)                  │
│  REST API · Prisma ORM · Rate Limiting · CORS            │
└──────────┬─────────────────────┬────────────────────────┘
           │                     │
┌──────────▼──────────┐ ┌───────▼──────────┐
│   PostgreSQL 16      │ │    Redis 7        │
│   (Primary Store)    │ │    (Cache Layer)  │
└─────────────────────┘ └──────────────────┘
```

All services are orchestrated via `podman-compose` in production. Locally, the frontend and backend run as separate Node processes managed by `start-local.js`.

---

## Tech Stack

**Frontend**

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| ORM (client-side queries) | Prisma Client 5 |

**Backend**

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Language | TypeScript 6 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| PokéAPI Client | pokedex-promise-v2 |
| Rate Limiting | express-rate-limit |

**Infrastructure**

| Purpose | Tool |
|---|---|
| Containerization | Podman + podman-compose |
| Deployment | Vercel (frontend + backend via `vercel.json` experimental services) |
| Process Management | systemd user service (`pokidex.service`) |

---

## Project Structure

```
POKIDEX/
├── backend/
│   ├── api/
│   │   └── index.ts              # Vercel serverless entry point
│   ├── prisma/
│   │   ├── schema.prisma         # Full database schema
│   │   └── seed.ts               # PokéAPI data seeder
│   ├── src/
│   │   ├── server.ts             # Express app, all route definitions
│   │   ├── services/
│   │   │   ├── pokeapi.service.ts  # PokéAPI fetch + DB hydration
│   │   │   └── pokemon.service.ts  # DB query helpers
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── slugify.ts
│   ├── .env.example
│   ├── Containerfile
│   ├── nodemon.json
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
│
├── frontend/
│   ├── prisma/
│   │   └── schema.prisma         # Shared schema for Prisma Client
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/              # Next.js route handlers (proxies to backend)
│   │   │   │   ├── compare/
│   │   │   │   ├── generations/
│   │   │   │   ├── legendaries/
│   │   │   │   ├── mythicals/
│   │   │   │   ├── pokemon/
│   │   │   │   ├── search/
│   │   │   │   └── types/
│   │   │   ├── pages/
│   │   │   │   ├── generations/  # Generation browser
│   │   │   │   ├── pokedex/      # Main Pokédex grid
│   │   │   │   ├── pokemon/[slug]/ # Pokémon detail page
│   │   │   │   └── types/        # Type explorer
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx          # Landing page
│   │   ├── components/
│   │   │   ├── EvolutionChain.tsx
│   │   │   ├── FeaturedCard.tsx
│   │   │   ├── FlavorTextList.tsx
│   │   │   ├── MoveTable.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PokedexClient.tsx  # Main interactive grid (client component)
│   │   │   ├── PokemonCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── StatBar.tsx
│   │   │   ├── StatPill.tsx
│   │   │   └── TypeBadge.tsx
│   │   └── lib/
│   │       ├── api.ts             # Typed fetch helpers (frontend → backend)
│   │       ├── pokeapi.service.ts # Direct PokéAPI access (server components)
│   │       ├── pokedex-utils.ts   # Shared utility types and helpers
│   │       └── prisma.ts          # Prisma singleton
│   ├── Containerfile
│   ├── next.config.mjs
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── podman-compose.yml             # PostgreSQL + Redis service definitions
├── pokidex.service                # systemd user service for cloud VMs
├── setup-podman.sh                # Automated Podman + podman-compose installer
├── start-local.js                 # Local dev process manager (concurrent processes)
├── start.ps1                      # Windows PowerShell dev starter
├── vercel.json                    # Vercel multi-service deployment config
└── package.json                   # Root scripts
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or use the included Podman compose)
- Redis 7 (or use the included Podman compose)
- `npm` or compatible package manager

For containerized setup:
- [Podman](https://podman.io/getting-started/installation) 4+
- `podman-compose` (`pip3 install podman-compose`)

---

### Local Development

**1. Clone the repository**

```bash
git clone https://github.com/your-username/POKIDEX.git
cd POKIDEX
```

**2. Install dependencies**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

**3. Configure environment variables**

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://pokewiki:password@localhost:5432/pokewiki"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-this-in-production"
PORT=4000
NODE_ENV=development
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**4. Start infrastructure (PostgreSQL + Redis)**

If you have Podman installed, spin up only the database services:

```bash
podman-compose up -d postgres redis
```

Otherwise, ensure a local PostgreSQL and Redis instance are running and match the `DATABASE_URL`/`REDIS_URL` above.

**5. Run database migrations and seed**

```bash
cd backend
npx prisma migrate deploy
npm run prisma:seed
cd ..
```

The seed script fetches Pokémon data from PokéAPI and populates the database. This takes several minutes on first run due to API rate limiting.

**6. Start development servers**

```bash
npm run dev
```

This runs `start-local.js`, which concurrently starts the Express backend on port `4000` and the Next.js frontend on port `3000` with color-coded terminal output.

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Health Check | http://localhost:4000/health |

---

### Container Deployment (Podman)

**Automated setup (Ubuntu / Debian / Amazon Linux 2023)**

```bash
chmod +x setup-podman.sh
./setup-podman.sh
```

This script removes Docker if present, installs Podman and `podman-compose`, enables rootless lingering, installs the systemd user service, and copies the environment template.

**Manual setup**

```bash
# Copy and edit environment
cp backend/.env.example backend/.env
# Edit backend/.env with production credentials

# Start all services (PostgreSQL, Redis, backend, frontend)
npm start
# or directly:
podman-compose up --build
```

**Run migrations and seed inside the container**

```bash
podman exec -it pokidex_backend npx prisma migrate deploy
podman exec -it pokidex_backend npm run prisma:seed
```

**systemd service (auto-start on reboot)**

```bash
systemctl --user enable pokidex
systemctl --user start pokidex
systemctl --user status pokidex
```

**Useful compose commands**

```bash
npm run logs      # Tail all container logs
npm run stop      # Tear down all containers
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_URL` | Redis connection string | — |
| `JWT_SECRET` | Secret for token signing | — |
| `PORT` | Express server port | `4000` |
| `NODE_ENV` | Runtime environment | `development` |
| `SCRAPE_DELAY_MS` | Delay between PokéAPI requests during seeding | `2000` |
| `SCRAPE_CONCURRENCY` | Parallel seeding workers | `1` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (client-visible) | `http://127.0.0.1:4000/api` |
| `BACKEND_URL` | Internal backend URL used by Next.js rewrites (server-side only) | `http://localhost:4000` |

---

## API Reference

All routes are prefixed with `/api`. The backend runs on port `4000` by default.

### Health

```
GET /health
```

Returns `{ "status": "ok", "timestamp": "..." }`.

---

### Pokémon

```
GET /api/pokemon
```

Returns a paginated list of Pokémon.

| Query Parameter | Type | Description |
|---|---|---|
| `page` | integer | Page number (default: `1`) |
| `limit` | integer | Results per page (max: `100`, default: `20`) |
| `generation` | integer | Filter by generation number |
| `type` | string | Filter by type name (e.g. `fire`) |
| `legendary` | boolean | Filter legendaries (`true` / `false`) |
| `mythical` | boolean | Filter mythicals (`true` / `false`) |

```
GET /api/pokemon/:idOrSlug
```

Accepts a national dex number or slug. Returns the full Pokémon record with types, stats, sprites, moves, abilities, flavor texts, and evolution chain.

```
GET /api/pokemon/:idOrSlug/stats
GET /api/pokemon/:idOrSlug/moves
GET /api/pokemon/:idOrSlug/flavor-texts
```

Granular sub-resource endpoints for stats, moves, and flavor texts respectively.

---

### Search

```
GET /api/search?q=<query>
```

Full-text search against the `SearchIndex` table. Returns matching Pokémon, types, or other indexed entities.

---

### Types

```
GET /api/types
GET /api/types/:name
```

List all types or fetch a specific type with strength/weakness/immunity data and the Pokémon belonging to it.

---

### Generations

```
GET /api/generations
GET /api/generations/:number
```

List all generations or fetch a specific generation by number, including region, games, Pokémon count, and new mechanics introduced.

---

### Collections

```
GET /api/legendaries
GET /api/mythicals
```

Returns all legendary or mythical Pokémon respectively.

---

### Compare

```
GET /api/compare?ids=25,6
```

Returns a subset of data for the given Pokémon IDs for side-by-side comparison.

---

## Database Schema

The database is managed by Prisma and backed by PostgreSQL. Core models:

| Model | Description |
|---|---|
| `Pokemon` | Primary entity — national dex, slug, name, height, weight, flags, and relations |
| `Generation` | Generation metadata — region, games, release year, mechanics |
| `Type` | Type data — name, strong against, weak against, immune to |
| `PokemonType` | Junction — Pokémon ↔ Type (with slot) |
| `Ability` | Ability name, display name, description, and effect |
| `PokemonAbility` | Junction — Pokémon ↔ Ability (hidden flag, slot) |
| `PokemonStat` | Base stats per Pokémon (HP, Attack, Defense, etc.) |
| `Move` | Move data — type, category, power, accuracy, PP, effect |
| `PokemonMove` | Junction — Pokémon ↔ Move (learn method, level, game version) |
| `PokemonSprite` | Sprite URLs per generation (official artwork, animated, shiny) |
| `FlavorText` | Pokédex entries per game version and language |
| `EvolutionChain` | Stores full chain as JSON |
| `PokemonForm` | Regional, Mega, and Gmax forms with stat/type overrides |
| `EggGroup` | Breeding egg group definitions |
| `CompetitiveSet` | Competitive EV spreads, held items, movesets, and tiers |
| `SearchIndex` | Flat search table for fast full-text lookups |

Full schema definition: [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)

---

## Deployment

### Vercel

The project includes a `vercel.json` configured for Vercel's experimental multi-service deployments.

```json
{
  "experimentalServices": {
    "frontend": { "root": "frontend", "routePrefix": "/", "framework": "nextjs" },
    "backend":  { "root": "backend",  "routePrefix": "/_api", "entrypoint": "api/index.ts" }
  }
}
```

The backend is deployed as a serverless function via `backend/api/index.ts`. Set the `BACKEND_URL` environment variable in the Vercel frontend service to point at the backend service URL.

### Self-hosted (Cloud VM)

Use the included `setup-podman.sh` script on any Ubuntu, Debian, or Amazon Linux 2023 instance. After setup, the application runs as a rootless `systemd` user service that starts automatically on reboot.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: description of change"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Commit messages should follow [Conventional Commits](https://www.conventionalcommits.org/).

---

## License

ISC — see [`LICENSE`](LICENSE) for details.

---

<sub>Data sourced from <a href="https://pokeapi.co">PokéAPI</a>. This project is unofficial and not affiliated with Nintendo, Game Freak, or The Pokémon Company.</sub>
