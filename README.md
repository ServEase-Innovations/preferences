# Preferences API (user settings / locations)

Express **5** service (ESM) backed by **MongoDB**. Exposes user-settings routes under **`/api/user-settings`**, OpenAPI via **`/api-docs`**, plus **Prometheus** metrics and JSON file logging for **Loki/Grafana**.

## Quick reference

| Item | Detail |
|------|--------|
| **Default port** | `3000` (`PORT` env); monorepo root uses **`3001`** |
| **Swagger** | `http://localhost:<PORT>/api-docs` |
| **Metrics** | `GET /metrics` — scrape job **`preferences-app`** |
| **Logs** | `logs/app.log` — Loki label **`{job="preferences-app"}`** |

## Prerequisites

- Node.js 18+
- MongoDB (`MONGO_URI`, `DB_NAME` in `.env`)

## Install & run

```bash
npm install
npm run dev
```

## Environment

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port |
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | Database name |

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
