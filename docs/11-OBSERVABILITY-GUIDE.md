# Observability Guide (Prometheus + Grafana) — Concepts

> **Build configs:** [labs/week-06/07-monitoring-lab.md](./labs/week-06/07-monitoring-lab.md)

## Why Monitoring Exists

Production systems fail silently without metrics:

- Is the API slow?
- Error rate spiking?
- Disk full?

**SRE mindset:** Measure → Alert → Fix → Postmortem

## Stack in This Project

| Tool | Role | Port |
|------|------|------|
| Instrumentator | Exposes `/metrics` on FastAPI | 8000 |
| Prometheus | Scrapes and stores metrics | 9090 |
| Grafana | Dashboards and visualization | 3001 |

## Start Monitoring

```bash
docker compose --profile monitoring up -d
```

## Verify Prometheus

1. Open http://localhost:9090
2. Status → Targets → `product-review-tracker-api` should be **UP**
3. Query: `http_requests_total`

## Grafana Login

- URL: http://localhost:3001
- User: `admin` / Password: `admin` (change in production!)

Add Prometheus datasource (auto-provisioned from `monitoring/grafana/provisioning/`).

## Key Metrics to Watch

| Metric | Meaning |
|--------|---------|
| `http_requests_total` | Request count by path/method |
| `http_request_duration_seconds` | Latency histogram |
| `process_resident_memory_bytes` | Memory usage |

## Create a Simple Dashboard

1. Grafana → Dashboards → New
2. Add panel → Prometheus query: `rate(http_requests_total[5m])`
3. Title: "Request rate"

Screenshot this for your portfolio README.

## Alerting (Future)

Prometheus **Alertmanager** sends Slack/PagerDuty when thresholds breach.

**Difficulty:** Medium  
**Skills:** SLOs, on-call, incident response

## What NOT to Do

- Expose Grafana admin password publicly
- Scrape metrics over public internet without auth
- Log sensitive user data in metrics labels

## Optional: Kubernetes Monitoring

If you move to K8s later, use **ServiceMonitor** CRD — same Prometheus concepts.

See [12-OPTIONAL-KUBERNETES-GUIDE.md](./12-OPTIONAL-KUBERNETES-GUIDE.md)
