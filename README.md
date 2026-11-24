# Release Beacon

A small Node.js service used as the application under a DevOps deployment
exercise. The app was supplied by the dev side. The platform work around it is
mine.

> **Status: containerized and shipping through CI. Not yet deployed to AWS.**
> This README says what is built, not what is planned. The gap is named at the
> bottom.

---

## What I built

### A multi-stage image that cannot ship a failing test

Three stages on `node:22-alpine`, version-pinned, never `latest`:

1. **test** installs every dependency and runs `npm test`
2. **production-deps** installs production dependencies only, then clears the npm cache
3. **production** copies just those dependencies and the application

The tests run **inside the build**. If they fail there is no image, so a broken
build cannot be shipped by accident.

The runtime stage:

* runs as the non-root `node` user, with `--chown=node:node` on every copy
* carries no dev dependencies and no build tooling
* declares `STOPSIGNAL SIGTERM`, so the container is asked to stop rather than killed
* has a `HEALTHCHECK` that parses the JSON from `/health` and checks that `status` is `ok`

That last point is the one worth arguing about. A service can answer HTTP 200
while being useless. The check asks the question it actually means.

### A pipeline that verifies its own output

`.github/workflows/cicd.yml`, two jobs:

| Job | What it does |
|---|---|
| **test** | Node 22 with npm caching, `npm ci`, `npm test` |
| **build-and-push** | `needs: test`, so it cannot run on a red build. Buildx build, publish to GHCR tagged by commit SHA, then `docker buildx imagetools inspect` to confirm the image is really there |

Two deliberate choices:

* **Pull requests build but do not publish.** Both the GHCR login and the push
  are gated on `github.event_name == 'push'`. A PR proves the image builds
  without putting anything in the registry.
* **Least-privilege tokens.** The workflow is `contents: read` by default.
  `packages: write` is granted only to the job that actually publishes.

The last step inspects the published image rather than trusting the exit code of
the step before it.

---

## What is not here

The exercise brief in [`docs/TASK_DESCRIPTION.md`](docs/TASK_DESCRIPTION.md)
also covers AWS host provisioning, deployment, runtime configuration, rollback
and teardown. None of that is in this repository, and this README is not going
to imply otherwise.

That work exists, in depth, on a different project:
**[linkr-platform](https://github.com/Alfred-Omosona/linkr-platform)**, which
carries Terraform-provisioned AWS staging, keyless SSM access, Prometheus and
Grafana monitoring with an alert demonstrated firing, and a runbook with a
measured 6 second rollback.

---

## Running it

Node.js 22 and npm.

```bash
npm ci
npm test
npm start
```

Open `http://localhost:3000`. `GET /health` returns HTTP 200.

Or in a container:

```bash
docker build -t beacon .
docker run --rm -p 3000:3000 beacon
```

### Configuration

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP port inside the process |
| `APP_ENV` | No | `local` | Visible environment name |
| `RELEASE_SHA` | No | `dev` | Visible commit or release identifier |

No database, no build step, no persistent disk, no secrets.
