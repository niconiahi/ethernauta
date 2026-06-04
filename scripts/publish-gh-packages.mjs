#!/usr/bin/env node
// Dual-publish: after `changeset publish` ships every public package to
// npmjs.org, this script re-publishes the same versions to GitHub Packages
// (https://npm.pkg.github.com) so the GitHub "Packages" sidebar populates.
//
// Each package is `npm publish`ed from its own folder. The CI workflow
// configures NODE_AUTH_TOKEN + a per-scope registry via .npmrc before
// invoking. "Already published" errors are non-fatal — the loop continues
// so a partial run can be re-driven safely.

import { execSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const repo_root = resolve(here, "..")
const packages_dir = resolve(repo_root, "packages")
const REGISTRY = "https://npm.pkg.github.com"

let any_failed = false
for (const folder of readdirSync(packages_dir)) {
  const pkg_path = join(packages_dir, folder, "package.json")
  let pkg
  try {
    pkg = JSON.parse(readFileSync(pkg_path, "utf8"))
  } catch {
    continue
  }
  if (pkg.private) {
    console.log(`- skipping ${pkg.name ?? folder} (private)`)
    continue
  }
  console.log(`→ publishing ${pkg.name}@${pkg.version} to GitHub Packages`)
  try {
    execSync(`npm publish --registry=${REGISTRY} --access=public --no-git-checks`, {
      cwd: join(packages_dir, folder),
      stdio: "inherit",
      env: process.env,
    })
  } catch (e) {
    any_failed = true
    console.warn(`  ✗ ${pkg.name}@${pkg.version} — ${e.message.split("\n")[0]}`)
  }
}

if (any_failed) {
  console.warn(
    "\nOne or more packages failed to publish to GitHub Packages. This may be a transient or already-published error — inspect the logs above. Exiting with a soft signal (0) so npm publishes still count as a successful release.",
  )
}
