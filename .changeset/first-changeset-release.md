---
"@ethernauta/core": patch
---

First release driven by Changesets. This bump tests the full CI pipeline end-to-end: `validate.yml` (typecheck + lint + escape-hatches ratchet) runs on push, then `publish.yml` opens the "Version Packages" PR via `changesets/action`. Merging that PR triggers the second `publish.yml` run, which dual-publishes every `@ethernauta/*` package to npmjs.org **and** `npm.pkg.github.com`, then creates the corresponding GitHub Release with the auto-generated changelog.

No code changes ship in this version — it exists to validate the release pipeline itself before any feature work.
