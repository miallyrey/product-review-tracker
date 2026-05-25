# Optional Kubernetes Guide (Advanced)

> **Skip until Weeks 1–6 are complete.** Docker Compose is enough for junior DevOps portfolios.

## When Companies Use Kubernetes

- Many microservices
- Auto-scaling and self-healing
- Multi-cloud portability

A single EC2 + Docker Compose is valid for small apps and learning.

## Core Concepts (Simple)

| Concept | Analogy |
|---------|---------|
| **Pod** | One or more containers sharing network |
| **Deployment** | Keeps N copies of your app running |
| **Service** | Stable IP/DNS to reach pods |
| **Ingress** | HTTP routing from outside cluster |

## Example Deployment (Backend)

Save as `k8s/backend-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prt-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: prt-backend
  template:
    metadata:
      labels:
        app: prt-backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/YOUR_USERNAME/product-review-tracker/backend:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: prt-secrets
                  key: database_url
---
apiVersion: v1
kind: Service
metadata:
  name: prt-backend
spec:
  selector:
    app: prt-backend
  ports:
    - port: 8000
      targetPort: 8000
```

## Apply (with minikube or EKS)

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl port-forward svc/prt-backend 8000:8000
```

## Learning Path to K8s

1. Master Docker Compose ✓
2. Learn `kubectl` basics on minikube
3. Deploy this app to EKS (AWS managed K8s)
4. Add Helm charts for packaging

**Difficulty:** Hard  
**Resume impact:** High if you can explain pods vs deployments in interviews

## Cost Warning

EKS control plane costs ~$0.10/hour. Use **minikube** or **kind** locally for free practice.
