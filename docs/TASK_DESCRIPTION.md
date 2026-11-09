# Task description: deploy Release Beacon to AWS

## Ticket

**ID:** DEVOPS-PRACTICE-001  
**Requested by:** Application Development Team  
**Assignee:** Junior DevOps Engineer  
**Priority:** Learning project  

## Business request

The development team has supplied a working application in this repository. We need a repeatable delivery path that tests the application, packages it as a container, and deploys it to one low-cost AWS EC2 instance. A reviewer must be able to open a public HTTP URL and see which release is running.

## Required delivery flow

```text
Developer commit
  → GitHub repository
  → GitHub Actions tests
  → container image build
  → image published to GitHub Container Registry
  → deployment to AWS EC2
  → HTTP and health verification
```

## Acceptance criteria

1. The repository is hosted on GitHub and uses meaningful commits.
2. `npm test` passes locally and in GitHub Actions.
3. A root-level `Dockerfile` builds the application with Node.js 22.
4. A root-level `.dockerignore` excludes unnecessary and sensitive files.
5. The container runs as a non-root user and listens on container port `3000`.
6. `GET /health` returns HTTP 200 from the running container.
7. The GitHub Actions workflow is stored at `.github/workflows/ci-cd.yml`.
8. The workflow tests every pull request and push to `main`.
9. A successful `main` build publishes an image tagged with the Git commit SHA to GitHub Container Registry.
10. AWS uses the account's **default VPC**, one EC2 instance, and one dedicated security group.
11. The security group permits HTTP port `80` from the internet and SSH port `22` only from the engineer's current public IP address.
12. The EC2 host runs the container with `APP_ENV=production` and `RELEASE_SHA` set to the deployed Git SHA.
13. The container restarts automatically after a process failure or EC2 reboot.
14. The live application is reachable at `http://<EC2-public-address>/`.
15. The live health endpoint is reachable at `http://<EC2-public-address>/health`.
16. No AWS credentials, SSH private keys, tokens, or passwords are committed to Git.
17. The README contains deployment, verification, troubleshooting, rollback, and cleanup instructions written by the assignee.

## Cost and scope constraints

- Use one small EC2 instance appropriate for practice.
- Use the default VPC; do not create NAT gateways, load balancers, managed databases, Kubernetes clusters, or a custom domain.
- Stop or terminate the instance when practice is complete.
- Cost eligibility varies by AWS account. Check the AWS console and pricing information before launching the instance.

## Out of scope

- HTTPS and a custom domain
- High availability or autoscaling
- Kubernetes
- A database
- Terraform for the first attempt

After the manual AWS deployment is understood, recreate the same EC2 instance and security group with Terraform as a separate exercise.

