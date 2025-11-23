# Example Prompts for Zypher Infra-Architect

## Docker
- Create a multi-stage Dockerfile for a Rust Axum web server on port 8080.
- Create a production Dockerfile for a Node.js Express API using pnpm.

## Kubernetes
- Create deployment.yaml + service.yaml for a Rust web server with 2 replicas.
- Add liveness + readiness probes to the deployment.
- Add an HPA scaling 2–10 pods based on 70% CPU.

## CI / CD
- Create a GitHub Actions workflow that runs cargo fmt, clippy, and tests on push.
- Create a GitLab CI pipeline for a Node/React app with build + test stages.

## Audit
- Read my Dockerfile and suggest improvements.
- Read deployment.yaml and point out missing probes or resource limits.
