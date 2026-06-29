# ISP Management Dashboard

Next.js dashboard for ISP operations. Real-time monitoring of clients, PPPoE sessions, and traffic consumption.

## Features

- **Real-time stats**: Auto-refreshing client and session counters
- **Consumption charts**: Bar chart for top consumers, pie chart for plan distribution
- **Quota alerts**: Visual indicators for clients approaching or exceeding their quota
- **Responsive design**: Works on desktop and mobile

## Architecture Decisions

- **Next.js with standalone output**: Optimized Docker image, minimal footprint
- **Recharts**: Lightweight, customizable charts without heavy dependencies
- **Tailwind CSS**: Utility-first styling for rapid development
- **API proxy**: Routes `/api/*` to backend service automatically

## Quick Start

```bash
npm install
npm run dev
```

Access at `http://localhost:3000`
