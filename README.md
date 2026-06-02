# Preferences Service

User saved-locations/settings API.

## Epoch-first contract

Location/settings responses now include epoch mirrors for timestamp fields:

- document-level: `createdAt_epoch`, `updatedAt_epoch`
- saved location entries (when present): `createdAt_epoch`, `updatedAt_epoch`

Request compatibility aliases:

- save/update accepts both `customerId` and `customer_id`

Legacy fields remain unchanged for compatibility.
# Preferences API (user settings / locations)

Express **5** service (ESM) backed by **MongoDB**. Exposes user-settings routes under **`/api/user-settings`**, OpenAPI via **`/api-docs`**, plus **Prometheus** metrics and JSON file logging for **Loki/Grafana**.

## Quick reference

| Item | Detail |
|------|--------|
| **Default port** | `3000` (`PORT` env); monorepo root uses **`3001`** |
| **Swagger** | `http://localhost:<PORT>/api-docs` (also `GET /openapi.json`, `GET /_whoami`, `GET /health`) |
| **Metrics** | `GET /metrics` — scrape job **`preferences-app`** |
| **Logs** | `logs/app.log` — Loki label **`{job="preferences-app"}`** |

## Prerequisites

- Node.js 18+
- MongoDB reachable from the connection string you put in **`.env`**

## Install & run

```bash
cp .env.example .env   # set MONGO_URI (see table below)
npm install
npm run dev
```

## Swagger / docs return 401 (JSON) with `auth.unauthorized`?

This service does **not** require auth for `/api-docs` or `/_whoami`. That response body usually means **this process is not the preferences app** (another app on the same port, a proxy, or a corporate gateway on `localhost`).

Check:

```bash
curl -sI http://localhost:3001/_whoami
# expect: 200, header X-ServeEaso-Service: preferences

lsof -i :3001
# confirm: node (nodemon) is your monorepo preferences, not e.g. Grafana/another stack
```

If **`lsof` shows `com.docke` (Docker)**, run `docker ps` — a container (often **Grafana** as `*:3001->3000/tcp`) is taking the port; Grafana will redirect to `/login`. `docker stop <container>` or recreate the stack with Grafana on another host port (this repo’s coupons/providers monitoring stacks use **3101** / **3102** so **3001** stays free for preferences).

If the header is missing, stop the other process or change `PORT` for this service in the monorepo root `package.json` and in your `.env`.

## Environment

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (monorepo `npm run dev` sets **3001**) |
| `MONGO_URI` | **Required.** MongoDB connection string, e.g. `mongodb://127.0.0.1:27017` if using `docker compose` from the monorepo root. |
| `MONGODB_URI` | Optional alias for `MONGO_URI` (either may be set). |
| `DB_NAME` | Optional database name |

## Observability (Prometheus + Grafana + Loki)

- **`src/monitoring/prometheus.js`** — HTTP histogram/counters.
- **`src/middleware/requestMetrics.js`** — records each response.
- **`src/utils/logger.js`** — JSON lines to **`logs/app.log`**.

**Docker stack** (Prometheus **9203**, Grafana **3203**, Loki **3123** — avoids clashing with other services):

```bash
npm run monitoring:up
```

1. Start this API (port must match `monitoring/prometheus/prometheus.yml`, default **3001** for monorepo).
2. Open **Grafana** at http://localhost:3203 (admin/admin).
3. **Explore → Loki**: `{job="preferences-app"}`.
4. Dashboard **Preferences API monitoring** is provisioned automatically.

Stop: `npm run monitoring:down`.

## Project layout

```
server.js
docker-compose.monitoring.yml
monitoring/          # prometheus, promtail, grafana
src/
  middleware/requestMetrics.js
  monitoring/prometheus.js
  utils/logger.js
  routes/
  controllers/
  config/
```

## License

ISC (see `package.json`).
