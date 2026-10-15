import { defineConfig } from "vite";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";

const autBuild = (() => {
  if (process.env.VITE_AUT_BUILD) return process.env.VITE_AUT_BUILD;
  try {
    const revision = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
    }).trim();
    const paths = execFileSync(
      "git",
      [
        "ls-files",
        "-c",
        "-o",
        "--exclude-standard",
        "--",
        "src",
        "public",
        "index.html",
        "package.json",
        "package-lock.json",
        "vite.config.ts",
      ],
      { encoding: "utf8" },
    )
      .trim()
      .split("\n");
    const hash = createHash("sha256");
    for (const path of [...new Set(paths)].sort()) {
      hash.update(path);
      hash.update(readFileSync(path));
    }
    return `${revision}-${hash.digest("hex").slice(0, 16)}`;
  } catch {
    return "local-unversioned";
  }
})();

export default defineConfig({
  define: { "import.meta.env.VITE_AUT_BUILD": JSON.stringify(autBuild) },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (info) =>
          info.name?.endsWith(".css")
            ? "assets/main.css"
            : "assets/[name][extname]",
      },
    },
  },
});
