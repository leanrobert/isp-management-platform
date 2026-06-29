# ISP Management API

Node.js/Express API for ISP operations: client management, PPPoE provisioning, and RADIUS-style traffic accounting.

## Features

- **Client Management**: CRUD operations with plan assignment
- **PPPoE Provisioning**: Automated user creation with IP assignment
- **Traffic Accounting**: Session-based consumption tracking
- **Dashboard Analytics**: Top consumers, quota usage, global stats

## Architecture Decisions

- **MySQL with connection pooling**: Handles concurrent PPPoE session writes efficiently
- **Normalized schema**: Separates clients, plans, PPPoE users, and accounting sessions for flexibility
- **RESTful design**: Clear resource boundaries for easy integration

## Quick Start

```bash
npm install
npm run migrate
npm run dev
```

## Endpoints

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | /health                      | Health check                     |
| GET    | /api/clients                 | List all clients                 |
| GET    | /api/clients/:id             | Client detail with usage history |
| POST   | /api/clients                 | Create client                    |
| GET    | /api/plans                   | List plans                       |
| GET    | /api/pppoe                   | List PPPoE users                 |
| POST   | /api/pppoe                   | Create PPPoE user                |
| POST   | /api/accounting/session      | Start session                    |
| PUT    | /api/accounting/session/:id  | Close session                    |
| GET    | /api/accounting/usage/:id    | Monthly usage                    |
| GET    | /api/dashboard/stats         | Global stats                     |
| GET    | /api/dashboard/top-consumers | Top 20 consumers                 |
