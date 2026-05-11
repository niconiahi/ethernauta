import { readFileSync, writeFileSync } from "node:fs"

const manifest = JSON.parse(
  readFileSync("./dist/manifest.json", "utf-8"),
)
const strip = (arr) =>
  arr.filter((e) => !e.includes("localhost"))

manifest.host_permissions = strip(manifest.host_permissions)
manifest.content_scripts[0].matches = strip(
  manifest.content_scripts[0].matches,
)
manifest.web_accessible_resources[0].matches = strip(
  manifest.web_accessible_resources[0].matches,
)

writeFileSync(
  "./dist/manifest.json",
  JSON.stringify(manifest, null, 2),
)
