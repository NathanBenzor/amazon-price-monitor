# Amazon Price Monitor – Design Notes

## Overview

This application monitors a configurable set of Amazon product URLs, runs scheduled price checks, stores every check in SQLite, compares the current price against the previous successful result, and sends a Slack notification when a configured price-drop threshold is met. A small React dashboard displays tracked products and historical check data.

The system is split into a few clear layers:

- configuration for products and runtime settings
- scraping for fetching and parsing Amazon product pages
- persistence using Prisma + SQLite
- a price-check runner that orchestrates scraping, comparison, persistence, and notifications
- a scheduler that runs checks on a configurable interval
- a frontend read side for product summaries and history visualization

## Tradeoff 1: SQLite vs PostgreSQL

I considered PostgreSQL because it is closer to a production setup and better aligned with the role description, which mentioned PostgreSQL as preferred. I chose SQLite for this take-home because it reduced setup time and operational complexity, which let me spend more of the time box implementing the actual monitoring workflow.

I still used Prisma and a relational schema so the migration path to PostgreSQL would be straightforward. If this project were taken further, PostgreSQL would likely be the next storage step.

## Tradeoff 2: `node-cron` vs more complex scheduling infrastructure

I considered more robust job execution models, including queue-backed workers or a dedicated job system. I chose `node-cron` because it was simple, easy to explain, and sufficient for a small take-home project.

This choice satisfied the requirement for configurable periodic checks without adding infrastructure overhead. At larger scale, I would likely move scheduling and execution into a queue-backed worker model so jobs could be retried, distributed, and controlled more safely.

## Tradeoff 3: Slack webhook vs email notifications

I considered email notifications via Nodemailer, but chose Slack because it was faster to configure, easier to verify end to end, and met the notification requirement cleanly. Email would have introduced additional SMTP setup, credential management, and deliverability concerns without improving the core project much in the time available.

Slack gave me a real, externally visible notification path while keeping the implementation small and demo-friendly.

## Tradeoff 4: Concurrent checks vs sequential checks

Sequential execution is simpler and puts less pressure on external sites, but the requirement explicitly called for tracking multiple products concurrently. I chose concurrent execution with `Promise.allSettled()` so checks for multiple products could run in parallel while still isolating failures.

`Promise.allSettled()` was a good fit here because one failed scrape should not stop the rest of the batch. If this grew beyond a small number of products, I would likely introduce concurrency limits to avoid overloading external dependencies.

## Future Improvements

If this project were extended further, I would likely:

- move from SQLite to PostgreSQL
- add concurrency limits and retry/backoff logic
- make the scraper more resilient to anti-bot responses
- improve the dashboard with chart-based visualization
- add a dedicated recent-alerts read model for UI notifications
