#!/usr/bin/env node
/**
 * Wraps `next dev` and tees stdout+stderr to both terminal and `logs/dev.log`.
 *
 * Why: lets agents read the running server's logs from disk to diagnose
 * runtime errors without scraping the user's terminal.
 *
 * Usage: `npm run dev` (configured in package.json).
 *
 * - Log file is truncated on every start (single-run history).
 * - Press Ctrl+C as usual; signals are forwarded to the child.
 */
import { spawn } from "node:child_process";
import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const logDir = resolve(repoRoot, "logs");
const logPath = resolve(logDir, "dev.log");

mkdirSync(logDir, { recursive: true });
const logStream = createWriteStream(logPath, { flags: "w" });

const header = `--- next dev started ${new Date().toISOString()} ---\n`;
process.stdout.write(header);
logStream.write(header);

const isWindows = process.platform === "win32";
const nextBin = resolve(repoRoot, "node_modules", ".bin", isWindows ? "next.cmd" : "next");
const child = spawn(nextBin, ["dev", ...process.argv.slice(2)], {
  cwd: repoRoot,
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
  shell: isWindows,
});

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  logStream.write(chunk);
});
child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  logStream.write(chunk);
});

const forward = (sig) => () => {
  if (!child.killed) child.kill(sig);
};
process.on("SIGINT", forward("SIGINT"));
process.on("SIGTERM", forward("SIGTERM"));

child.on("exit", (code, signal) => {
  const trailer = `--- next dev exited (code=${code} signal=${signal ?? "none"}) ---\n`;
  process.stdout.write(trailer);
  logStream.write(trailer);
  logStream.end(() => process.exit(code ?? 0));
});

child.on("error", (err) => {
  const msg = `--- failed to spawn next dev: ${err.message} ---\n`;
  process.stderr.write(msg);
  logStream.write(msg);
  logStream.end(() => process.exit(1));
});
