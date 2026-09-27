# Cyber Security Society

Cyber Security Society is a fictional, sandboxed cybersecurity learning platform built as an interactive browser experience. Students investigate incidents, analyse suspicious messages, explore simulated web labs, and solve a cyber escape room.

## Static deployment

This repository is configured for GitHub Pages. The site is a fully static React/Vite build with hash-based navigation, so routes work when hosted beneath the repository URL.

The static version intentionally does not include the former database, OAuth, server API, invitation event, student-ID collection, or administrator claim workflow. Progress, demo sign-in, mission completion, and local admin prototypes use the browser's local storage only. No real systems are contacted and no sensitive information should be entered.

## Local development

```bash
pnpm install
pnpm dev
```

Run validation and create the production bundle with:

```bash
pnpm check
pnpm test
pnpm build
```

## GitHub Pages

A GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and deploys `dist/` on every push to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.
