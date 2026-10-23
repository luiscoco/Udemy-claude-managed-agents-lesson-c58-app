# C58 · Shipping: CI, Providers and SDK Upgrades

Evaluates a local CI evidence record. It does not perform an SDK upgrade, deploy an artifact, or certify remote compatibility. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- SDK contract and adapter smoke differ
- Release gates bind to build evidence
- An unrun required check blocks release

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3058`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3058
```

## How the app was build

### 1. Keep each release check explicit

Type checking, offline tests, locked build and adapter smoke are separate supplied observations. An unrun smoke is not a successful smoke.

Source: [src/lesson.ts](src/lesson.ts#L13)

```typescript
const checks = {
  typecheck: flag(input, "typecheck"),
  offline: flag(input, "offlineTests"),
  lockedBuild: flag(input, "lockedBuild"),
  adapterSmoke: text(input, "smoke"),
};
```

### 2. Require the complete release gate

Every required check must pass, including the exact passed smoke label. The evidence is bound to a seeded artifact hash and deployed:false; the sample evaluates release inputs without building or deploying an artifact.

Source: [src/lesson.ts](src/lesson.ts#L14) · selected statements

```typescript
const releaseAllowed =
  checks.typecheck &&
  checks.offline &&
  checks.lockedBuild &&
  checks.adapterSmoke === "passed";

return report(
  releaseAllowed ? "passed" : "rejected",
  releaseAllowed
    ? "The declared local release gate was satisfied"
    : "A required check failed or was not run",
  {
    releaseAllowed,
    checks,
    artifactHash: hash("reviewed-demo-build"),
    deployed: false,
  },
  [
    "Compile actual adapter contracts",
    "Run authored host scenarios",
    "Bind checks to the locked build artifact",
    "Require a separate live adapter smoke when policy requires it",
  ],
);
```

### Check your understanding

Run **Pass the required release checks** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "typecheck": true,
    "offlineTests": true,
    "lockedBuild": true,
    "smoke": "passed"
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "releaseAllowed": true
  }
}
```

Then try **Block an unrun adapter smoke**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
