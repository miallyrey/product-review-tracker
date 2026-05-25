# Lab 07 — Prometheus + Grafana

**Prerequisites:** Docker Compose stack working locally.  
**Goal:** Add monitoring profile — write config files manually.

---

## Checkpoint 1 — Prometheus config

```bash
mkdir -p monitoring/grafana/provisioning/datasources
mkdir -p monitoring/grafana/provisioning/dashboards/json
```

**FILE:** `monitoring/prometheus.yml`

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "product-review-tracker-api"
    static_configs:
      - targets: ["backend:8000"]
    metrics_path: /metrics
```

**EXPLANATION:** Prometheus scrapes FastAPI `/metrics` every 15s. Target `backend:8000` is the Compose service name.

---

## Checkpoint 2 — Grafana datasource

**FILE:** `monitoring/grafana/provisioning/datasources/prometheus.yml`

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
```

**FILE:** `monitoring/grafana/provisioning/dashboards/dashboard.yml`

```yaml
apiVersion: 1

providers:
  - name: "Product Review Tracker"
    orgId: 1
    folder: ""
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/provisioning/dashboards/json
```

---

## Checkpoint 3 — Extend docker-compose.yml

Add these services to your **existing** `docker-compose.yml` (append before `volumes:`):

```yaml
  prometheus:
    image: prom/prometheus:v2.54.1
    container_name: prt-prometheus
    profiles: ["monitoring"]
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    ports:
      - "9090:9090"
    depends_on:
      - backend

  grafana:
    image: grafana/grafana:11.3.0
    container_name: prt-grafana
    profiles: ["monitoring"]
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
    ports:
      - "3001:3000"
    volumes:
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
    depends_on:
      - prometheus
```

**Note:** Backend already exposes `/metrics` via `prometheus-fastapi-instrumentator` in `main.py` (Week 1).

---

## Checkpoint 4 — Run and verify

```bash
docker compose --profile monitoring up -d
```

| URL | Expected |
|-----|----------|
| http://localhost:9090/targets | `product-review-tracker-api` state **UP** |
| http://localhost:3001 | Grafana login `admin` / `admin` |
| Prometheus query `http_requests_total` | Data after hitting API |

**TEST:** Refresh your app in browser, then run query in Prometheus UI.

---

## Checkpoint 5 — Grafana dashboard (manual)

1. Grafana → Connections → Data sources → Prometheus (should exist)
2. Dashboards → New → Add visualization
3. Query: `rate(http_requests_total[5m])`
4. Save dashboard — screenshot for portfolio README

**MISTAKES:**

| Issue | Fix |
|-------|-----|
| Target DOWN | Backend not on same Docker network |
| Empty metrics | Generate traffic — curl `/health` and `/api/products` |

**Lab program complete.** Optional: [12-OPTIONAL-KUBERNETES-GUIDE.md](../../12-OPTIONAL-KUBERNETES-GUIDE.md)
