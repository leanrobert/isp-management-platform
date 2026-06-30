# ISP Management Platform

A full-stack platform for managing ISP operations: client provisioning, PPPoE user management, traffic accounting, and real-time monitoring. Built to demonstrate modern infrastructure practices applied to a traditional ISP environment.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js       │────▶│   Node.js API   │────▶│   MySQL         │
│   Dashboard     │     │   (Express)     │     │   (Master)      │
│   Port 3000     │◀────│   Port 3001     │◀────│   Port 3306     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │  Prometheus     │
         │              │  Port 9090      │
         │              └────────┬────────┘
         │                       │
         │              ┌────────┴────────┐
         └─────────────▶│  Grafana        │
                        │  Port 3002      │
                        └─────────────────┘
```

## Why This Project Exists

Most ISPs grow organically: they start with manual configurations, spreadsheets, and ad-hoc scripts. This platform demonstrates how to modernize that environment with:

- **Infrastructure as Code**: Reproducible environments with Terraform + Ansible
- **Containerization**: Docker for consistent deployments
- **Observability**: Prometheus + Grafana + alerting
- **Full-stack application**: Modern API + dashboard for operations

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Make (optional, for convenience commands)

### Run Everything

```bash
# Clone and enter the project
cd isp-management-platform

# Build and start all services
make build
make up

# Or manually:
docker-compose up --build -d

# Run database migrations
make migrate

# Check status
make status
```

### Access Points

| Service    | URL                   | Credentials           |
| ---------- | --------------------- | --------------------- |
| Dashboard  | http://localhost:3000 | -                     |
| API        | http://localhost:3001 | -                     |
| Prometheus | http://localhost:9090 | -                     |
| Grafana    | http://localhost:3002 | admin/admin           |
| MySQL      | localhost:3306        | isp_user/isp_password |

## Project Structure

```
isp-management-platform/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── config/       # Database & migration
│   ├── Dockerfile
│   └── README.md
├── frontend/             # Next.js dashboard
│   ├── src/
│   │   ├── components/   # Reusable UI
│   │   ├── pages/        # Next.js pages
│   │   └── lib/          # Utilities
│   ├── Dockerfile
│   └── README.md
├── infrastructure/       # IaC
│   ├── terraform/        # Proxmox provider
│   └── ansible/          # Server provisioning
├── monitoring/           # Observability
│   ├── prometheus/       # Metrics collection
│   ├── grafana/          # Dashboards
│   └── alertmanager/     # Alert routing
├── docker-compose.yml    # Local orchestration
└── Makefile              # Common commands
```

## Key Features

### Client Management

- Create and manage ISP clients with plan assignment
- Track client status (active, suspended, cancelled)

### PPPoE Provisioning

- Automated user creation with IP assignment
- Password hashing with bcrypt
- Session tracking

### Traffic Accounting

- Session-based consumption tracking
- Monthly quota calculation
- Real-time usage statistics

### Dashboard Analytics

- Global statistics (clients, active PPPoE, plans)
- Top consumers ranking with quota alerts
- Consumption distribution by plan
- Auto-refreshing data (30s interval)

### Monitoring & Alerting

- Prometheus metrics collection
- Grafana dashboards for infrastructure
- Alertmanager with Telegram integration
- Health checks on all services

## API Endpoints

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | /health                      | Service health check             |
| GET    | /api/clients                 | List all clients                 |
| GET    | /api/clients/:id             | Client detail with usage history |
| POST   | /api/clients                 | Create new client                |
| GET    | /api/plans                   | List available plans             |
| GET    | /api/pppoe                   | List PPPoE users                 |
| POST   | /api/pppoe                   | Create PPPoE user                |
| POST   | /api/accounting/session      | Start accounting session         |
| PUT    | /api/accounting/session/:id  | Close session                    |
| GET    | /api/accounting/usage/:id    | Monthly usage                    |
| GET    | /api/dashboard/stats         | Global statistics                |
| GET    | /api/dashboard/top-consumers | Top 20 consumers                 |

## Infrastructure Decisions

### Why Docker Compose for local development?

Provides a consistent, reproducible environment that mirrors production. No "works on my machine" issues.

### Why separate backend and frontend?

- Frontend can be served statically (CDN-ready)
- Backend scales independently
- API can be consumed by other clients (mobile, CLI)

### Why MySQL with connection pooling?

ISPs typically use relational databases for billing and provisioning. Connection pooling handles concurrent PPPoE session writes efficiently.

### Why Prometheus + Grafana instead of SaaS?

Demonstrates self-hosted observability — critical for ISPs handling sensitive customer data and needing on-premise solutions.

## Production Deployment

### On Proxmox (via Terraform + Ansible)

```bash
cd infrastructure/terraform/proxmox

# Configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

### Manual Server Setup

```bash
# On a fresh Ubuntu 22.04 server
cd infrastructure/ansible
ansible-playbook -i inventory playbooks/setup-isp.yml
```

## Testing

```bash
# Backend tests
make test

# Or manually:
cd backend
npm test
```

## Future Improvements

- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] API authentication (JWT)
- [ ] Rate limiting
- [ ] Database replication (master-slave)
- [ ] Backup automation
- [ ] Multi-tenant support

## License

MIT

## Author

Built as a portfolio project to demonstrate end-to-end infrastructure and development skills for ISP environments.
