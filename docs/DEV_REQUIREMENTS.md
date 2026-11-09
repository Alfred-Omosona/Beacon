# Developer requirements and application contract

This document describes what the application needs from the delivery platform. Treat every filename, port, command, and environment variable as an exact requirement.

## Runtime

- Runtime: Node.js `22.x`
- Package manager: npm
- Dependency install command: `npm ci`
- Test command: `npm test`
- Start command: `npm start`
- Application port: `3000`
- Bind address: `0.0.0.0`
- CPU architecture: `linux/amd64`

## Required files supplied by Development

- `package.json`
- `package-lock.json`
- `src/app.js`
- `src/server.js`
- `public/`
- `test/app.test.js`

Do not rename these files or substitute a different start command without a developer-approved code change.

## HTTP contract

| Method | Path | Expected response | Purpose |
|---|---|---|---|
| GET | `/` | `200 text/html` | Human-visible deployment page |
| GET | `/health` | `200 application/json` | Container and deployment health check |
| GET | `/api/info` | `200 application/json` | Safe environment and release metadata |
| GET | unknown path | `404 application/json` | Predictable not-found response |

The `/health` response includes `status: "ok"`. Monitoring and deployment verification may rely on this exact value.

## Environment variables

| Name | Production value | Sensitive? |
|---|---|---:|
| `PORT` | `3000` | No |
| `APP_ENV` | `production` | No |
| `RELEASE_SHA` | Exact deployed Git commit SHA | No |

The application requires no secrets. Registry credentials and SSH keys belong to the deployment system, not to application configuration.

## Container expectations

- The final image must contain production dependencies only.
- The final process must run as a non-root user.
- The image must declare port `3000`.
- The container command must use exec form and start the application with `npm start` or the exact equivalent `node src/server.js`.
- The running container must receive `SIGTERM` and have time to shut down cleanly.
- The host must publish port `80` to container port `3000`.

## Operational checks

The deployment is acceptable only when all checks succeed:

```text
local tests
local image build
local container health request
GitHub Actions test
GitHub Actions image build and publish
EC2 container running
public /health request
public browser page
release SHA on page matches deployed commit
```

If a check fails, preserve logs and investigate before changing multiple things.

