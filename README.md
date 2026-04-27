# Amazon Price Monitor

A full-stack take-home project that monitors multiple Amazon products, stores durable price history, detects price drops, and sends Slack notifications when a configured threshold is met.

## Overview

This application monitors a configurable set of Amazon product URLs, runs price checks on a schedule, stores every check in SQLite, compares the current price to the previous successful check, and sends a Slack notification when a meaningful drop is detected.

The project includes:

- A Node.js + TypeScript backend using Express
- SQLite + Prisma for durable persistence
- An Amazon scraping layer using Axios + Cheerio
- A scheduler for periodic checks
- Slack webhook notifications for price drops
- A React + Vite frontend for viewing tracked products and price history
- Automated tests across scraping, storage, comparison, and notification layers

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express
- Prisma
- SQLite
- Axios
- Cheerio
- node-cron
- Pino
- Vitest

### Frontend

- React
- TypeScript
- Vite

## Project Structure

```text
amazon-price-monitor/
  prisma/
  src/
    api/
    config/
    domains/
    infrastructure/
    shared/
  test/
frontend/
  src/
```

## Core Features

- Track 3+ configurable Amazon products
- Run scheduled price checks on a configurable interval
- Persist every price check in durable storage
- Detect price drops compared to the previous successful check
- Send Slack notifications when the configured threshold is met
- Display tracked products and price history in the frontend dashboard
- Log scheduler runs, price checks, and notification outcomes
- Handle failures without crashing the system
- Test the most important logic paths

## Installation

### Prerequisites

- Node.js 18+
- npm

## Backend Setup

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with your local values.

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

The backend runs by default at:

```text
http://localhost:4000
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

## Environment Configuration

### Backend `.env`

Required or commonly used values:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
PRICE_DROP_THRESHOLD_PERCENT=5
SLACK_WEBHOOK_URL=""
PRICE_CHECK_CRON="*/15 * * * *"
```

### Product Configuration

Tracked products are configured in:

```text
/src/config/products.json
```

This allows products to be added or removed without changing application code.

Example:

```json
[
  {
    "id": "echo-dot",
    "name": "Echo Dot",
    "url": "https://www.amazon.com/dp/...",
    "isActive": true
  }
]
```

## Running the Application

### Start backend

```bash
at root of application run:
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

### Run tests

```bash
at root of application run:
npm test
```

## API Endpoints

### Health

```http
GET /api/health
```

### Product summaries

```http
GET /api/products
```

Returns dashboard-friendly product data including latest check information.

### Product history

```http
GET /api/products/:productId/history
```

Returns historical price checks for a specific product.

### Manual check

```http
POST /api/checks/:productId
```

Runs a manual price check for a specific product.

## How to Verify It Works End to End

### 1. Start backend and frontend

Backend:

```bash
at root of application run:
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

### 2. Confirm product summaries load

Open the frontend dashboard in the browser and verify that tracked products are displayed.

You can also verify through the backend API:

```bash
curl http://localhost:4000/api/products
```

### 3. Run a manual check

Use Postman or curl:

```bash
curl -X POST http://localhost:4000/api/checks/echo-dot
```

Verify that the response includes:

- product data
- scrape result
- comparison result
- persisted `priceCheck`

### 4. Verify durable history

Call:

```bash
curl http://localhost:4000/api/products/echo-dot/history
```

or inspect with Prisma Studio:

```bash
at root of application run:
npx prisma studio
```

### 5. Verify scheduled checks

Set a short cron interval in `.env` for local testing, for example:

```env
PRICE_CHECK_CRON="*/1 * * * *"
```

Restart the backend and confirm that new `PriceCheck` rows appear over time.

### 6. Verify Slack notifications

Add a valid Slack incoming webhook URL to:

```env
SLACK_WEBHOOK_URL="your_webhook_here"
```

To test the notification path, trigger a real or simulated price drop and verify:

- `comparison.meetsThreshold === true`
- `notificationResult.success === true`
- a Slack message appears in the configured channel

If Slack is not configured, the application should still run and fail gracefully on notification delivery.

### 7. Verify frontend history visualization

In the dashboard:

- select a product
- view its price history table
- confirm that timestamps, prices, and statuses are displayed correctly
- verify that the price drop card appears when the selected product’s latest history reflects a drop

## Logging and Observability

The backend uses Pino for structured logging.

Important log events include:

- scheduler start and completion
- price check start and finish
- scrape success/failure
- persistence success
- price comparison results
- Slack notification success/failure

These logs are intended to make it possible to understand what happened during a check cycle without needing to inspect the database directly.

## Tests

The backend includes focused tests for the most important logic layers:

- scraper parsing using HTML fixtures
- storage persistence
- price comparison logic
- Slack notification behavior

Run the tests with:

```bash
at root of application run:
npm test
```

## Requirement Mapping

### 1. Monitor multiple products

Implemented using configurable product definitions in `products.json` and runtime product syncing into the database.

### 2. Periodic price checks

Implemented with `node-cron` and a configurable cron expression.

### 3. Durable price history

Implemented with Prisma + SQLite and persistent `PriceCheck` records.

### 4. Price-drop detection and notification

Implemented with price comparison logic and Slack webhook notifications.

### 5. Price history visualization

Implemented with the React dashboard and product history table.

### 6. Configurable parameters

Implemented through `.env` and `products.json`.

### 7. Logging and observability

Implemented with Pino lifecycle logs across scheduler, checks, and notifications.

### 8. Failure handling

Scrape failures, notification failures, and per-product check failures are isolated so the system continues running.

### 9. Tests

Implemented with focused Vitest coverage across the main layers.

## Future Improvements

If this were extended further, likely next steps would include:

- moving from SQLite to PostgreSQL
- adding concurrency limits for external requests
- improving scraper resilience for anti-bot responses
- adding chart-based visualization
- adding retry/backoff for notifications and scrape failures
- adding a dedicated recent-alerts read model

## Notes for Reviewers

- Real Amazon scraping may intermittently fail due to anti-bot behavior or markup changes.
- Slack is the implemented external notification channel.
- The dashboard is intentionally simple and focused on demonstrating the core monitoring workflow.

# AI Notes

One place where my AI assistant oversimplified the build was the Prisma setup.

The initial guidance assumed a more familiar Prisma configuration pattern with the datasource URL defined in `schema.prisma` and a straightforward `new PrismaClient()` setup. When I actually ran the migration commands, Prisma returned a `P1012` error because the installed version was Prisma 7, which changed how datasource configuration and client setup work.

I caught this by running the migration flow and reading the actual error output instead of assuming the setup was correct. Because this was a short take-home project, I chose to downgrade to Prisma 6 rather than spend additional time adapting the project to Prisma 7’s newer configuration model. That fix let me keep the implementation simple and focus on the core requirements of the assignment.

There were also a few smaller places where the AI guidance needed correction:

- **Amazon scraping:** early guidance understated how often live requests could fail or be blocked.

- **Notifications:** getting Slack working was only part of the requirement; reviewer visibility and configurability also mattered.

- **Frontend read model:** the first pass was too close to raw backend entities, so I reshaped the API for the dashboard.

The main lesson for me was that AI-generated guidance is useful for acceleration, but version-specific tooling, real runtime behavior, and exact requirement wording still need to be validated carefully during the build.
