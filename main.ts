import {
  ZypherAgent,
  OpenAIModelProvider,
  runAgentInTerminal,
  createZypherContext,
} from "jsr:@corespeed/zypher@0.5.1";
import { createTool } from "jsr:@corespeed/zypher@0.5.1/tools";
import { z } from "npm:zod@3.25.67";
import { join } from "jsr:@std/path@1.0.8";

/**
 * Zypher Infra-Architect (OpenAI edition)
 *
 * Tools:
 * - write_config_file: create infra files (Dockerfile / K8s YAML / CI)
 * - read_config_file: read infra files for audit
 *
 * Requires:
 *   OPENAI_API_KEY in .env
 *
 * Run:
 *   deno run -A --env-file=.env main.ts
 */

const USER_CWD = Deno.cwd();

// Setup Environment
const apiKey = Deno.env.get("OPENAI_API_KEY");
if (!apiKey) {
  console.error("❌ Please set OPENAI_API_KEY in your .env file");
  Deno.exit(1);
}

// Define tools
const writeConfigTool = createTool({
  name: "write_config_file",
  description:
    "Generate infrastructure configuration files (Dockerfile, Kubernetes YAML, CI pipelines, Cargo.toml, etc).",
  schema: z.object({
    filename: z
      .string()
      .describe("Exact file name, e.g. Dockerfile, deployment.yaml"),
    content: z
      .string()
      .describe("Full valid file contents to write"),
    description: z
      .string()
      .describe("Short summary of what this file does"),
  }),
  execute: async ({ filename, content, description }) => {
    const outPath = join(USER_CWD, filename);
    console.log(`\n⚡ TRIGGERED: write_config_file for ${filename}`);
    console.log(`📌 Writing to: ${outPath}`);

    try {
      await Deno.writeTextFile(outPath, content);
      console.log(`✅ WROTE ${outPath} (${content.length} bytes)`);
      return `Success: created ${filename} at ${outPath}. ${description}`;
    } catch (err) {
      console.error(`❌ Write failed: ${err.message}`);
      return `Error: ${err.message}`;
    }
  },
});

const readConfigTool = createTool({
  name: "read_config_file",
  description: "Read an infra config file for audit.",
  schema: z.object({
    filename: z.string().describe("File name to read"),
  }),
  execute: async ({ filename }) => {
    const inPath = join(USER_CWD, filename);
    console.log(`\n👀 Reading ${inPath}`);
    try {
      return await Deno.readTextFile(inPath);
    } catch (err) {
      return `Error reading file: ${err.message}`;
    }
  },
});

// Initialize Context
const context = await createZypherContext(USER_CWD);

// Create Agent with OpenAI provider
const agent = new ZypherAgent(
  context,
  new OpenAIModelProvider({
    apiKey,
    reasoningEffort: "medium",
  }),
  {
    systemPrompt: `
You are a Senior DevOps Engineer.

TOOLS YOU CAN USE:
- write_config_file(filename, content, description)
- read_config_file(filename)

HARD RULES:
1. If the user asks for infra code (Dockerfile / K8s / CI / Cargo.toml),
   you MUST CALL write_config_file.
2. Do NOT paste the full file in chat.
3. Use exact filenames like "Dockerfile", "deployment.yaml".
4. After tool success, reply with a short confirmation and a 3–5 line preview.

TOOL CALL EXAMPLE:
<tool_use name="write_config_file">
{"filename":"Dockerfile","content":"FROM alpine:3.20\\n...","description":"multi-stage Rust build"}
</tool_use>
`.trim(),
  }
);

// Register tools
agent.mcp.registerTool(writeConfigTool);
agent.mcp.registerTool(readConfigTool);

// Sanity prints
console.log("Registered tools:", [...agent.mcp.tools.keys()]);
console.log("🚀 Zypher Infra-Architect (Powered by OpenAI) is online.");
console.log(`📂 Project directory: ${USER_CWD}`);
console.log("Try: 'Create a multi-stage Dockerfile for a Rust web server'");

// Start interactive CLI
await runAgentInTerminal(agent, "gpt-4.1-mini");