import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 58,
  title: "Shipping: CI, Providers and SDK Upgrades",
  description: "Shipping an agent host means shipping a tested application protocol as well as a server process. The source recommends offline fixtures in CI and treats SDK upgrades as gated releases.",
  concepts: ["SDK contract and adapter smoke differ", "Release gates bind to build evidence", "An unrun required check blocks release"],
  scope: "Evaluates a local CI evidence record. It does not perform an SDK upgrade, deploy an artifact, or certify remote compatibility. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Pass the required release checks", "input": {"typecheck": true, "offlineTests": true, "lockedBuild": true, "smoke": "passed"}, "expected": "passed", "checks": {"releaseAllowed": true}}, {"id": "1", "label": "Block an unrun adapter smoke", "input": {"typecheck": true, "offlineTests": true, "lockedBuild": true, "smoke": "not_run"}, "expected": "rejected", "checks": {"releaseAllowed": false}}, {"id": "2", "label": "Block a failed type probe", "input": {"typecheck": false, "offlineTests": true, "lockedBuild": true, "smoke": "passed"}, "expected": "rejected", "checks": {"releaseAllowed": false}}],
  async run(input) {

const checks={typecheck:flag(input,"typecheck"),offline:flag(input,"offlineTests"),lockedBuild:flag(input,"lockedBuild"),adapterSmoke:text(input,"smoke")};
const releaseAllowed=checks.typecheck&&checks.offline&&checks.lockedBuild&&checks.adapterSmoke==="passed";
return report(releaseAllowed?"passed":"rejected",releaseAllowed?"The declared local release gate was satisfied":"A required check failed or was not run",{releaseAllowed,checks,artifactHash:hash("reviewed-demo-build"),deployed:false},["Compile actual adapter contracts","Run authored host scenarios","Bind checks to the locked build artifact","Require a separate live adapter smoke when policy requires it"]);

  }
};
