# GenAI Playground - OpenShift Reference Architecture

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Infrastructure Design](#infrastructure-design)
4. [OpenShift Project Structure](#openshift-project-structure)
5. [Application Deployment](#application-deployment)
6. [Data Layer](#data-layer)
7. [Security Architecture](#security-architecture)
8. [Networking & Load Balancing](#networking--load-balancing)
9. [Monitoring & Observability](#monitoring--observability)
10. [High Availability & Disaster Recovery](#high-availability--disaster-recovery)
11. [Performance Optimization](#performance-optimization)
12. [Operational Procedures](#operational-procedures)
13. [Deployment Automation](#deployment-automation)
14. [Cost Optimization](#cost-optimization)
15. [Compliance & Governance](#compliance--governance)

## Executive Summary

This reference architecture provides a production-ready deployment strategy for the GenAI Playground on Red Hat OpenShift Container Platform. The design emphasizes scalability, security, high availability, and operational excellence while leveraging OpenShift's enterprise-grade container orchestration capabilities.

### Key Benefits
- **Enterprise Security**: Built-in security features and compliance capabilities
- **Scalability**: Horizontal and vertical scaling with auto-scaling
- **High Availability**: Multi-zone deployment with automatic failover
- **Operational Excellence**: Integrated monitoring, logging, and CI/CD
- **Cost Efficiency**: Resource optimization and workload consolidation

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    OpenShift Container Platform                 │
├─────────────────────────────────────────────────────────────────┤
│  OpenShift Router (HAProxy) - Load Balancer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Route     │  │   Route     │  │   Route     │            │
│  │  (HTTPS)    │  │  (Internal) │  │   (API)     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  Application Layer                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Frontend   │  │   Backend   │  │   Workers   │            │
│  │  (React)    │  │   (API)     │  │ (Inference) │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ PostgreSQL  │  │   Redis     │  │   MinIO     │            │
│  │ (Primary)   │  │ (Cache)     │  │ (Storage)   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Monitoring  │  │   Logging   │  │   Tracing   │            │
│  │ (Prometheus)│  │ (EFK Stack) │  │ (Jaeger)    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Container Platform** | Red Hat OpenShift 4.x | Container orchestration and management |
| **Frontend** | React + Vite | User interface |
| **Backend** | Node.js/Express | API services |
| **Database** | PostgreSQL 15+ | Primary data store |
| **Cache** | Redis 7+ | Session and data caching |
| **Storage** | MinIO | Object storage for models and assets |
| **Monitoring** | Prometheus + Grafana | Metrics and alerting |
| **Logging** | Elasticsearch + Fluentd + Kibana | Centralized logging |
| **Tracing** | Jaeger | Distributed tracing |
| **GPU Compute - Inference** | AMD Instinct MI355X (8x per node) | High-performance AI inference |
| **GPU Compute - Blueprints** | AMD Instinct MI300X (8x per node) | Blueprint development and training |
| **CI/CD** | OpenShift Pipelines (Tekton) | Automated deployment |

## Infrastructure Design

### OpenShift Cluster Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    OpenShift Cluster                           │
├─────────────────────────────────────────────────────────────────┤
│  Control Plane (3 nodes)                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Master 1    │  │ Master 2    │  │ Master 3    │            │
│  │ (etcd)      │  │ (etcd)      │  │ (etcd)      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure Nodes (3 nodes)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Infra 1     │  │ Infra 2     │  │ Infra 3     │            │
│  │ (Router)    │  │ (Router)    │  │ (Router)    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  Application Nodes (6+ nodes)                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ App 1       │  │ App 2       │  │ App 3       │            │
│  │ (Zone A)    │  │ (Zone A)    │  │ (Zone B)    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ App 4       │  │ App 5       │  │ App 6       │            │
│  │ (Zone B)    │  │ (Zone C)    │  │ (Zone C)    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│  GPU Nodes (4+ nodes)                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ GPU Node 1  │  │ GPU Node 2  │  │ GPU Node 3  │  │ GPU Node 4  │ │
│  │ (8xMI355X)  │  │ (8xMI355X)  │  │ (8xMI300X)  │  │ (8xMI300X)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Node Specifications

#### Control Plane Nodes
- **CPU**: 8+ cores
- **Memory**: 32GB+ RAM
- **Storage**: 200GB+ SSD
- **Network**: 10Gbps

#### Infrastructure Nodes
- **CPU**: 16+ cores
- **Memory**: 64GB+ RAM
- **Storage**: 500GB+ SSD
- **Network**: 25Gbps

#### Application Nodes
- **CPU**: 32+ cores
- **Memory**: 128GB+ RAM
- **Storage**: 1TB+ NVMe SSD
- **Network**: 25Gbps

#### GPU Nodes - MI355X (AI Inference)
- **CPU**: 64+ cores
- **Memory**: 512GB+ RAM
- **GPU**: 8x AMD Instinct MI355X (fixed form factor)
- **Storage**: 4TB+ NVMe SSD
- **Network**: 200Gbps
- **Purpose**: High-performance AI model inference

#### GPU Nodes - MI300X (Blueprint Workloads)
- **CPU**: 64+ cores
- **Memory**: 512GB+ RAM
- **GPU**: 8x AMD Instinct MI300X (fixed form factor)
- **Storage**: 4TB+ NVMe SSD
- **Network**: 200Gbps
- **Purpose**: Blueprint development and training workloads

## OpenShift Project Structure

### Project Organization

```yaml
# OpenShift Projects
genai-playground/
├── genai-frontend/          # Frontend application
├── genai-backend/           # Backend API services
├── genai-workers/           # Inference worker pods
├── genai-database/          # Database services
├── genai-storage/           # Object storage
├── genai-monitoring/        # Monitoring stack
├── genai-logging/           # Logging stack
└── genai-cicd/              # CI/CD pipelines
```

### Resource Quotas and Limits

```yaml
# Resource Quotas
apiVersion: v1
kind: ResourceQuota
metadata:
  name: genai-quota
  namespace: genai-playground
spec:
  hard:
    requests.cpu: "64"
    requests.memory: 256Gi
    limits.cpu: "128"
    limits.memory: 512Gi
    requests.storage: 1Ti
    persistentvolumeclaims: "20"
    services: "50"
    pods: "100"
```

### Network Policies

```yaml
# Network Policy for Frontend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-network-policy
  namespace: genai-frontend
spec:
  podSelector:
    matchLabels:
      app: genai-frontend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: genai-backend
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: genai-backend
    ports:
    - protocol: TCP
      port: 8080
```

## Application Deployment

### GPU Workload Separation

```yaml
# Node Labels for GPU Type Separation
apiVersion: v1
kind: Node
metadata:
  name: gpu-node-mi355x-1
  labels:
    amd.com/gpu: "true"
    gpu-type: "mi355x"
    workload-type: "inference"
---
apiVersion: v1
kind: Node
metadata:
  name: gpu-node-mi300x-1
  labels:
    amd.com/gpu: "true"
    gpu-type: "mi300x"
    workload-type: "blueprint"
```

### Frontend Deployment

```yaml
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-frontend
  namespace: genai-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: genai-frontend
  template:
    metadata:
      labels:
        app: genai-frontend
    spec:
      containers:
      - name: frontend
        image: genai/frontend:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: REACT_APP_API_URL
          value: "https://api.genai-playground.com"
        - name: REACT_APP_ENVIRONMENT
          value: "production"
```

### Backend Deployment

```yaml
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-backend
  namespace: genai-backend
spec:
  replicas: 5
  selector:
    matchLabels:
      app: genai-backend
  template:
    metadata:
      labels:
        app: genai-backend
    spec:
      containers:
      - name: backend
        image: genai/backend:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        - name: MINIO_ENDPOINT
          value: "minio.genai-storage.svc.cluster.local"
        volumeMounts:
        - name: config
          mountPath: /app/config
      volumes:
      - name: config
        configMap:
          name: backend-config
```

### GPU Worker Deployment

```yaml
# GPU Worker Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-gpu-worker
  namespace: genai-workers
spec:
  replicas: 16
  selector:
    matchLabels:
      app: genai-gpu-worker
  template:
    metadata:
      labels:
        app: genai-gpu-worker
    spec:
      nodeSelector:
        amd.com/gpu: "true"
      containers:
      - name: gpu-worker
        image: genai/gpu-worker:latest
        resources:
          requests:
            amd.com/gpu: 1
            memory: "16Gi"
            cpu: "8"
          limits:
            amd.com/gpu: 1
            memory: "32Gi"
            cpu: "16"
        env:
        - name: HIP_VISIBLE_DEVICES
          value: "0,1,2,3,4,5,6,7"
        - name: MODEL_CACHE_DIR
          value: "/models"
        volumeMounts:
        - name: model-storage
          mountPath: /models
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-storage-pvc
```

### Blueprint GPU Worker Deployment

```yaml
# Blueprint GPU Worker Deployment (MI300X)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-blueprint-worker
  namespace: genai-workers
spec:
  replicas: 16
  selector:
    matchLabels:
      app: genai-blueprint-worker
  template:
    metadata:
      labels:
        app: genai-blueprint-worker
    spec:
      nodeSelector:
        amd.com/gpu: "true"
        gpu-type: "mi300x"
      containers:
      - name: blueprint-worker
        image: genai/blueprint-worker:latest
        resources:
          requests:
            amd.com/gpu: 8
            memory: "32Gi"
            cpu: "16"
          limits:
            amd.com/gpu: 8
            memory: "64Gi"
            cpu: "32"
        env:
        - name: HIP_VISIBLE_DEVICES
          value: "0,1,2,3,4,5,6,7"
        - name: BLUEPRINT_CACHE_DIR
          value: "/blueprints"
        - name: WORKLOAD_TYPE
          value: "blueprint"
        volumeMounts:
        - name: blueprint-storage
          mountPath: /blueprints
        - name: model-storage
          mountPath: /models
      volumes:
      - name: blueprint-storage
        persistentVolumeClaim:
          claimName: blueprint-storage-pvc
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-storage-pvc
```

## Data Layer

### PostgreSQL Database

```yaml
# PostgreSQL StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgresql
  namespace: genai-database
spec:
  serviceName: postgresql
  replicas: 3
  selector:
    matchLabels:
      app: postgresql
  template:
    metadata:
      labels:
        app: postgresql
    spec:
      containers:
      - name: postgresql
        image: postgres:15
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: "genai_playground"
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgresql-secret
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgresql-secret
              key: password
        volumeMounts:
        - name: postgresql-data
          mountPath: /var/lib/postgresql/data
        - name: postgresql-config
          mountPath: /etc/postgresql/postgresql.conf
          subPath: postgresql.conf
  volumeClaimTemplates:
  - metadata:
      name: postgresql-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
      storageClassName: fast-ssd
```

### Redis Cache

```yaml
# Redis Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: genai-database
spec:
  replicas: 3
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        volumeMounts:
        - name: redis-data
          mountPath: /data
        command:
        - redis-server
        - /etc/redis/redis.conf
        - --appendonly
        - "yes"
        volumeMounts:
        - name: redis-config
          mountPath: /etc/redis
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: redis-pvc
      - name: redis-config
        configMap:
          name: redis-config
```

### MinIO Object Storage

```yaml
# MinIO StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: minio
  namespace: genai-storage
spec:
  serviceName: minio
  replicas: 4
  selector:
    matchLabels:
      app: minio
  template:
    metadata:
      labels:
        app: minio
    spec:
      containers:
      - name: minio
        image: minio/minio:latest
        ports:
        - containerPort: 9000
        - containerPort: 9001
        env:
        - name: MINIO_ROOT_USER
          valueFrom:
            secretKeyRef:
              name: minio-secret
              key: access-key
        - name: MINIO_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: minio-secret
              key: secret-key
        command:
        - /bin/bash
        - -c
        - minio server /data --console-address ":9001"
        volumeMounts:
        - name: minio-data
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: minio-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 500Gi
      storageClassName: fast-ssd
```

## Security Architecture

### Authentication & Authorization

```yaml
# OAuth2 Proxy for Authentication
apiVersion: apps/v1
kind: Deployment
metadata:
  name: oauth2-proxy
  namespace: genai-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: oauth2-proxy
  template:
    metadata:
      labels:
        app: oauth2-proxy
    spec:
      containers:
      - name: oauth2-proxy
        image: quay.io/oauth2-proxy/oauth2-proxy:latest
        ports:
        - containerPort: 4180
        env:
        - name: OAUTH2_PROXY_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: oauth2-proxy-secret
              key: client-id
        - name: OAUTH2_PROXY_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: oauth2-proxy-secret
              key: client-secret
        - name: OAUTH2_PROXY_COOKIE_SECRET
          valueFrom:
            secretKeyRef:
              name: oauth2-proxy-secret
              key: cookie-secret
        - name: OAUTH2_PROXY_EMAIL_DOMAINS
          value: "company.com"
        - name: OAUTH2_PROXY_UPSTREAM
          value: "http://genai-frontend:3000"
```

### RBAC Configuration

```yaml
# Service Account for Backend
apiVersion: v1
kind: ServiceAccount
metadata:
  name: genai-backend-sa
  namespace: genai-backend
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: genai-backend-role
  namespace: genai-backend
rules:
- apiGroups: [""]
  resources: ["pods", "services", "endpoints"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch", "update"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: genai-backend-rolebinding
  namespace: genai-backend
subjects:
- kind: ServiceAccount
  name: genai-backend-sa
  namespace: genai-backend
roleRef:
  kind: Role
  name: genai-backend-role
  apiGroup: rbac.authorization.k8s.io
```

### Network Security

```yaml
# Network Policy for Database Access
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: database-network-policy
  namespace: genai-database
spec:
  podSelector:
    matchLabels:
      app: postgresql
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: genai-backend
    ports:
    - protocol: TCP
      port: 5432
```

## Networking & Load Balancing

### OpenShift Routes

```yaml
# Frontend Route
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: genai-frontend
  namespace: genai-frontend
spec:
  host: genai-playground.company.com
  to:
    kind: Service
    name: genai-frontend
    weight: 100
  port:
    targetPort: 3000
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
  annotations:
    haproxy.router.openshift.io/timeout: 300s
    haproxy.router.openshift.io/rate-limit-connections: "true"
    haproxy.router.openshift.io/rate-limit-http-status: "429"
```

### Service Mesh (Istio)

```yaml
# Virtual Service for API Gateway
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: genai-api-gateway
  namespace: genai-backend
spec:
  hosts:
  - api.genai-playground.company.com
  gateways:
  - genai-gateway
  http:
  - match:
    - uri:
        prefix: /api/v1/models
    route:
    - destination:
        host: genai-backend
        port:
          number: 8080
      weight: 100
  - match:
    - uri:
        prefix: /api/v1/chat
    route:
    - destination:
        host: genai-gpu-worker
        port:
          number: 8000
      weight: 100
```

## Monitoring & Observability

### Prometheus Configuration

```yaml
# Prometheus ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: genai-monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - "alert_rules.yml"
    
    scrape_configs:
      - job_name: 'genai-backend'
        static_configs:
          - targets: ['genai-backend:8080']
        metrics_path: /metrics
        scrape_interval: 10s
      
      - job_name: 'genai-frontend'
        static_configs:
          - targets: ['genai-frontend:3000']
        metrics_path: /metrics
        scrape_interval: 10s
      
      - job_name: 'gpu-workers'
        static_configs:
          - targets: ['genai-gpu-worker:8000']
        metrics_path: /metrics
        scrape_interval: 5s
      
      - job_name: 'blueprint-workers'
        static_configs:
          - targets: ['genai-blueprint-worker:8000']
        metrics_path: /metrics
        scrape_interval: 5s
```

### Grafana Dashboards

```yaml
# Grafana Dashboard ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  namespace: genai-monitoring
data:
  genai-overview.json: |
    {
      "dashboard": {
        "title": "GenAI Playground Overview",
        "panels": [
          {
            "title": "API Response Time",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
                "legendFormat": "95th percentile"
              }
            ]
          },
          {
            "title": "GPU Utilization",
            "type": "graph",
            "targets": [
              {
                "expr": "amd_gpu_utilization",
                "legendFormat": "GPU {{gpu}}"
              }
            ]
          }
        ]
      }
    }
```

### Alerting Rules

```yaml
# Alerting Rules
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: genai-alerts
  namespace: genai-monitoring
spec:
  groups:
  - name: genai.rules
    rules:
    - alert: HighAPIResponseTime
      expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High API response time"
        description: "API response time is above 2 seconds"
    
    - alert: GPUWorkerDown
      expr: up{job="gpu-workers"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "GPU worker is down"
        description: "GPU worker {{ $labels.instance }} is not responding"
    
    - alert: BlueprintWorkerDown
      expr: up{job="blueprint-workers"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Blueprint worker is down"
        description: "Blueprint worker {{ $labels.instance }} is not responding"
```

## High Availability & Disaster Recovery

### Multi-Zone Deployment

```yaml
# Pod Disruption Budget
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: genai-backend-pdb
  namespace: genai-backend
spec:
  minAvailable: 3
  selector:
    matchLabels:
      app: genai-backend
---
# Pod Anti-Affinity
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-backend
spec:
  template:
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - genai-backend
              topologyKey: topology.kubernetes.io/zone
```

### Backup Strategy

```yaml
# Velero Backup Schedule
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: genai-daily-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"
  template:
    includedNamespaces:
    - genai-database
    - genai-storage
    includedResources:
    - persistentvolumes
    - persistentvolumeclaims
    - secrets
    - configmaps
    storageLocation: default
    volumeSnapshotLocations:
    - default
    ttl: "720h"
```

## Performance Optimization

### Horizontal Pod Autoscaler

```yaml
# HPA for Backend
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: genai-backend-hpa
  namespace: genai-backend
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: genai-backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### Vertical Pod Autoscaler

```yaml
# VPA for GPU Workers
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: genai-gpu-worker-vpa
  namespace: genai-workers
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: genai-gpu-worker
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: '*'
      minAllowed:
        cpu: 100m
        memory: 50Mi
      maxAllowed:
        cpu: 8
        memory: 16Gi
      controlledResources: ["cpu", "memory"]
---
# VPA for Blueprint Workers
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: genai-blueprint-worker-vpa
  namespace: genai-workers
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: genai-blueprint-worker
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: '*'
      minAllowed:
        cpu: 100m
        memory: 50Mi
      maxAllowed:
        cpu: 32
        memory: 64Gi
      controlledResources: ["cpu", "memory"]
```

## Operational Procedures

### Deployment Process

```yaml
# OpenShift Pipeline for Deployment
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: genai-deployment-pipeline
  namespace: genai-cicd
spec:
  params:
  - name: git-url
  - name: git-revision
  - name: image-tag
  workspaces:
  - name: shared-workspace
  tasks:
  - name: fetch-repository
    taskRef:
      name: git-clone
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: url
      value: $(params.git-url)
    - name: revision
      value: $(params.git-revision)
  
  - name: build-frontend
    runAfter: ["fetch-repository"]
    taskRef:
      name: buildah
    workspaces:
    - name: source
      workspace: shared-workspace
    params:
    - name: IMAGE
      value: genai/frontend:$(params.image-tag)
    - name: DOCKERFILE
      value: ./frontend/Dockerfile
  
  - name: build-backend
    runAfter: ["fetch-repository"]
    taskRef:
      name: buildah
    workspaces:
    - name: source
      workspace: shared-workspace
    params:
    - name: IMAGE
      value: genai/backend:$(params.image-tag)
    - name: DOCKERFILE
      value: ./backend/Dockerfile
  
  - name: deploy
    runAfter: ["build-frontend", "build-backend"]
    taskRef:
      name: openshift-client
    params:
    - name: SCRIPT
      value: |
        oc set image deployment/genai-frontend frontend=genai/frontend:$(params.image-tag) -n genai-frontend
        oc set image deployment/genai-backend backend=genai/backend:$(params.image-tag) -n genai-backend
        oc rollout status deployment/genai-frontend -n genai-frontend
        oc rollout status deployment/genai-backend -n genai-backend
```

### Health Checks

```yaml
# Health Check Endpoints
apiVersion: v1
kind: ConfigMap
metadata:
  name: health-check-config
  namespace: genai-backend
data:
  health-check.sh: |
    #!/bin/bash
    
    # Check database connectivity
    pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
    
    # Check Redis connectivity
    redis-cli -h $REDIS_HOST -p $REDIS_PORT ping
    
    # Check MinIO connectivity
    mc alias set myminio $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
    mc admin info myminio
    
    # Check GPU availability
    rocm-smi
    
    # Check API endpoints
    curl -f http://localhost:8080/health
    curl -f http://localhost:8080/ready
```

## Deployment Automation

### GitOps with ArgoCD

```yaml
# ArgoCD Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: genai-playground
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/genai-playground-manifests
    targetRevision: HEAD
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: genai-playground
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
  revisionHistoryLimit: 10
```

### Helm Charts

```yaml
# Helm Chart Structure
genai-playground/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── route.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   └── ingress.yaml
└── charts/
    ├── frontend/
    ├── backend/
    ├── database/
    └── monitoring/
```

## Cost Optimization

### Resource Optimization

```yaml
# Resource Quotas with Cost Allocation
apiVersion: v1
kind: ResourceQuota
metadata:
  name: cost-aware-quota
  namespace: genai-playground
  annotations:
    cost-center: "ai-platform"
    budget: "50000"
spec:
  hard:
    requests.cpu: "64"
    requests.memory: 256Gi
    limits.cpu: "128"
    limits.memory: 512Gi
    requests.amd.com/gpu: "32"
    limits.amd.com/gpu: "64"
```

### Spot Instance Usage

```yaml
# Spot Instance Configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-gpu-worker-spot
spec:
  template:
    spec:
      nodeSelector:
        node.kubernetes.io/instance-type: "spot"
      tolerations:
      - key: "kubernetes.azure.com/scalesetpriority"
        operator: "Equal"
        value: "spot"
        effect: "NoSchedule"
      containers:
      - name: gpu-worker
        resources:
          requests:
            amd.com/gpu: 8
```

## Compliance & Governance

### Security Policies

```yaml
# Pod Security Standards
apiVersion: v1
kind: Pod
metadata:
  name: genai-backend-secure
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: backend
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    volumeMounts:
    - name: tmp
      mountPath: /tmp
  volumes:
  - name: tmp
    emptyDir: {}
```

### Compliance Monitoring

```yaml
# Compliance Policy
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: required-labels
spec:
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
  parameters:
    labels:
    - key: "security-level"
      allowedRegex: "^(low|medium|high)$"
    - key: "data-classification"
      allowedRegex: "^(public|internal|confidential|restricted)$"
```

## Conclusion

This reference architecture provides a comprehensive foundation for deploying the GenAI Playground on Red Hat OpenShift in a production environment. The design emphasizes:

### Key Success Factors
- **Scalability**: Horizontal and vertical scaling capabilities
- **Security**: Multi-layered security with compliance controls
- **High Availability**: Multi-zone deployment with automatic failover
- **Observability**: Comprehensive monitoring and alerting
- **Operational Excellence**: Automated deployment and management

### Implementation Phases
1. **Phase 1**: Core infrastructure and basic deployment
2. **Phase 2**: Security hardening and compliance
3. **Phase 3**: Advanced monitoring and optimization
4. **Phase 4**: Disaster recovery and business continuity

### Success Metrics
- **Availability**: 99.9% uptime target
- **Performance**: < 2s API response time (95th percentile)
- **Security**: Zero critical vulnerabilities
- **Cost**: 30% reduction in infrastructure costs
- **Compliance**: 100% policy compliance

This architecture ensures a robust, scalable, and maintainable production deployment of the GenAI Playground on OpenShift. 