# GrowthSphere — Business Analytics Dashboard

An interactive analytics dashboard that aggregates business KPIs (revenue, users, conversions, traffic) across regions and categories, with an auto-generated insights layer and a lightweight forecasting model.

**Live demo:** _add your deployed link here_

![Dashboard preview — light mode](./screenshots/dashboard-light.png)
![Dashboard preview — dark mode](./screenshots/dashboard-dark.png)

## Features

- **Multi-dimensional filtering** — date range, region, category, with live-recalculated KPIs and period-over-period change
- **7-day forecasting** — client-side linear regression projects near-term trends on top of historical data, with an R² fit indicator
- **Auto-generated insights & recommendations** — data-driven summaries computed from the current filter state, not hardcoded
- **Business health score** — a weighted composite of revenue growth, customer growth, conversion rate, and engagement
- **Dark / light theme** — full CSS-variable-driven theming
- **CSV export & downloadable text report** — for handing off analysis outside the app
- **Persisted filters** — survives page refresh via localStorage

## Tech Stack

- React + Vite
- Recharts for data visualization
- Lucide React for icons
- Client-side CSV parsing and aggregation (no backend dependency)

## Running locally

```bash
npm install
npm run dev
```

## What I'd build next

- FastAPI/Flask backend to serve data via a real API instead of a static CSV
- Swap the linear regression forecast for a proper time-series model (e.g. Prophet or ARIMA) for longer horizons
- User-configurable goal thresholds instead of hardcoded targets

---
Built as a portfolio project to demonstrate end-to-end data analysis: aggregation, KPI computation, trend forecasting, and dashboard design.