import { spawnSync } from "node:child_process";

const extraArgs = process.argv.slice(2);

const runPlaywright = (args) =>
  spawnSync("npx", ["playwright", "test", ...args], {
    stdio: "inherit",
    env: process.env,
  });

const regressionResult = runPlaywright([
  "--grep",
  "@regression",
  "--grep-invert",
  "@nonblocking",
  ...extraArgs,
]);

if (regressionResult.status !== 0) {
  process.exit(regressionResult.status ?? 1);
}

const nonblockingResult = runPlaywright([
  "--grep",
  "@nonblocking",
  ...extraArgs,
]);

if (nonblockingResult.status !== 0) {
  console.warn(
    "[test:e2e:all] Nonblocking suite failed. Keeping exit code 0 by design.",
  );
}
