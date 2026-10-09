# SurfJobs

**Reviewable job-application automation that fills what it knows and stops when human judgment is required.**

SurfJobs is a personal side project I built to remove repetitive work from job applications without turning the process into a black box. The core idea is simple: deterministic candidate facts can be filled automatically, but ambiguous or important questions should be surfaced for review rather than silently guessed.

**Live UI:** https://polarx0.github.io/surfjobs/

## Why I built it

Most application automation tools optimize for speed. I wanted something closer to a QA mindset: predictable behavior, visible decisions, explicit failure states and a human-controlled final submit.

SurfJobs therefore treats an application as a reviewable workflow rather than a fire-and-forget bot.

## What it does

- Parses candidate profile data and a tailored resume locally.
- Detects supported ATS/application flows.
- Fills deterministic fields such as name, email, LinkedIn and compatible resume uploads.
- Leaves nonstandard or unknown questions for manual completion.
- Exposes a passive debug trace showing what was filled, skipped and why.
- Keeps the final **Submit** action manual.
- Uses the user's normal Chrome session for ATS flows where that is safer than hidden browser automation.

## Current ATS coverage

- **Greenhouse** — native Playwright flow, with companion fallback.
- **Indeed** — Chrome companion flow.
- **Workable** — Chrome companion flow.
- **Ashby** — Chrome companion flow.

The architecture is intentionally adapter-oriented so additional ATS providers can be added without weakening the review/safety rules.

## Design principles

1. **Never invent candidate facts.**
2. Known profile data is filled deterministically.
3. Unknown required questions become a review stop.
4. `do-not-infer` means exactly that.
5. Final submission is always manual.
6. Automation should explain what it did instead of hiding decisions.

## Architecture

```text
GitHub Pages UI
      |
      v
SurfJobs Companion (Chrome extension)
      |
      +----> current ATS page / normal Chrome session
      |
      v
Local SurfJobs agent
      |
      +----> profile + local resume parsing
      +----> deterministic field mapping
      +----> Playwright/native ATS flows
      +----> review state + debug trace
```

The GitHub Pages UI communicates with a local Node.js agent through an allow-listed extension bridge. Candidate profile data stays in browser storage and resume files remain local to the machine.

## Tech stack

- TypeScript / Node.js
- Playwright
- Fastify
- Chrome extension APIs
- GitHub Pages
- Vitest
- Zod
- PDF/DOCX resume parsing

## What this project demonstrates

For me, SurfJobs is less about "autofill" and more about building a small reliable system around uncertainty. It combines browser automation, API/local-agent design, privacy boundaries, deterministic rules, debugging observability and real-world testing against changing third-party ATS pages.

It also reflects how I approach QA work: automate repeatable behavior, make failures diagnosable, and keep humans in control where requirements are ambiguous.

## Repository note

This public repository hosts the deployed GitHub Pages build. Development source is maintained separately.
