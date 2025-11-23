# Zypher Infra-Architect

A lightweight DevOps assistant built with **Zypher Agent**.  
It generates and audits infrastructure files like **Dockerfiles**, **Kubernetes manifests**, and **CI pipelines** using tool calling — writing output directly to disk.

---

## Building an Infra-Architect Agent

**Problem:**  
Starting a new service usually means a blank page for infra: Dockerfile, K8s YAML, CI workflows, etc. Rewriting these from scratch is slow and error-prone.

**Solution:**  
An AI agent that:
- understands infra requests in natural language
- plans which files are needed
- **writes configs to disk via tools**
- can **read existing configs** and suggest improvements

**What we’ll build:**  
A Zypher agent with two custom tools:
- `write_config_file` — creates infra files in your repo
- `read_config_file` — reads infra files for audit

---

## How It Works

To build Infra-Architect, we need two components:

1. **AI Brain (LLM)**  
   OpenAI GPT model to interpret requests and call tools.

2. **Infra Tools (Local MCP Tools)**  
   We register tools directly into Zypher’s MCP manager:
   - write infra files (Dockerfile/K8s/CI/etc)
   - read infra files for audit

> We don’t need an external MCP server here because the tools are local  
> (in-process). MCP servers are only required for tools that live in another
> process (Firecrawl, GitHub MCP, DB MCP, etc).

---

## Why This Is Relevant to CoreSpeed Roles

CoreSpeed roles emphasize:
- Kubernetes & cloud-native workflows
- CI/CD and production reliability
- dev-experience tooling for infra

Infra-Architect targets these directly by:
- bootstrapping Docker/K8s/CI instantly
- auditing manifests for missing probes/limits/security best practices
- demonstrating Zypher tool integration cleanly

---

## Prerequisites

- **Deno 2.x+**
- **OpenAI API key**

---

## Repository Layout

```
zypher-infra-architect/
├── main.ts
├── deno.json
├── README.md
├── .env.example
├── .gitignore
└── examples/
    └── prompts.md
```

---

## Setup

### 1) Clone
```bash
git clone <your-repo-url>
cd zypher-infra-architect
```

### 2) Add environment variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:
```env
OPENAI_API_KEY=your_openai_key_here
```

### 3) Run the agent
```bash
deno task start
```

or:
```bash
deno run -A --env-file=.env main.ts
```

---

## Usage

Type tasks in the CLI like:

- `Create a multi-stage Dockerfile for a Rust web server`
- `Create deployment.yaml + service.yaml for that server`
- `Create a GitHub Actions workflow for cargo fmt/clippy/test`
- `Read my deployment.yaml and suggest improvements`

You should see logs like:

```
🔧 Using tool: write_config_file
⚡ TRIGGERED: write_config_file for Dockerfile
📌 Writing to: /.../zypher-infra-architect/Dockerfile
✅ WROTE Dockerfile
```

Then the file appears in your repo folder.

---

## Example Prompts

See `examples/prompts.md` for a list of copy-paste prompts.

---

## Next Steps

- Add a GitHub MCP server to open PRs automatically
- Add a kubectl/cluster MCP server to validate manifests
- Add safety interceptors to block destructive operations

These would keep the code small while showing deeper infra maturity.

---

## License
MIT
