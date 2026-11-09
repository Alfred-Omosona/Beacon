# Release Beacon

Release Beacon is a small Node.js web service supplied by a development team for a beginner DevOps deployment exercise. Its purpose is to make a deployed environment and release identifier visible in the browser.

## Developer quick start

Requirements: Node.js 22 and npm.

```bash
npm ci
npm test
npm start
```

Open `http://localhost:3000`. Verify `http://localhost:3000/health` returns HTTP 200.

## Runtime configuration

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `PORT` | No | `3000` | HTTP port inside the application process |
| `APP_ENV` | No | `local` | Visible environment name |
| `RELEASE_SHA` | No | `dev` | Visible Git commit or release identifier |

The application does not require a database, build step, persistent disk, or secret values.

## Handoff boundary

The development team owns the application code and tests. The DevOps engineer owns containerization, CI/CD, AWS host provisioning, runtime configuration, deployment, verification, rollback instructions, and infrastructure cleanup.

Read [the task description](docs/TASK_DESCRIPTION.md) and [developer requirements](docs/DEV_REQUIREMENTS.md) before implementing anything.

