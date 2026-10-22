---
name: Coolify build selection
description: Bianco's root monorepo has both Python starter files and pnpm apps, affecting Coolify buildpack detection and domain routing.
---

Coolify Railpack at the repository root can detect the Python starter (`pyproject.toml` and `main.py`) and run `python main.py`, which only prints a greeting and exits. That causes restart loops while never building the restaurant website. For a web-only temporary deployment, explicitly choose Dockerfile build strategy and use the root web Dockerfile; for the full stack, choose Compose and load the root Compose file.

Coolify routes a public domain through its Domains settings to the web-facing service and its internal port; the domain should not be inferred from `expose` alone. For this project, route the site to the web container on port 80.

**Why:** The repository is a pnpm monorepo but retains Python starter files at root, and Coolify can prioritize Python auto-detection unless the build strategy is selected explicitly.

**How to apply:** When a Coolify deployment logs `Detected Python` or starts `python main.py`, check the resource build strategy before changing application code. In Compose deployments, assign the hostname to the `web` service through Coolify Domains; in single Dockerfile web deployments, route the hostname to port 80.
