/* eslint-disable no-console */
import { readdirSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import process from "node:process"
import { execSync } from "node:child_process"

const __dirname = dirname(fileURLToPath(import.meta.url))
const packagesDir = resolve(__dirname, "../../packages")

async function main() {
  const packages = readdirSync(packagesDir)
  for (const packageName of packages) {
    const packagePath = join(packagesDir, `${packageName}/dist`)
    if (statSync(packagePath).isDirectory()) {
      console.log(`Publishing ${packageName}...`)
      execSync(`pnpm publish --access public`, { stdio: "inherit", cwd: packagePath })
      console.log(`${packageName} published successfully.`)
    }
  }
}

main()
  .then(() => {
    console.log("All packages published successfully.")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Failed to publish packages:", error)
    process.exit(1)
  })
