---
name: git
description: Git commit conventions. Use always when creating commits — covers message format, scope usage, and type selection.
---

# Git Commit Conventions

Follow conventional commits. Every commit message follows: `type(scope): description`

## Types

| Type | When |
|------|------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `chore` | Maintenance, config, tooling, dependencies |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `test` | Adding or updating tests |
| `ci` | CI/CD changes |
| `deploy` | Deployment-related changes |

## Scope

- Use scope when the change is scoped to a clear domain: `feat(notifications):`, `fix(booking):`, `chore(infra):`
- Omit scope for cross-cutting changes: `feat: redesign profile page`
- Scope uses the domain name, not the file/folder: `notifications` not `src/lib/components/Notifications`
- Skill file changes use `skill` scope: `docs(skill): add lib utilities`

## Description

- ALWAYS one line. No body. No multi-line messages. EVER.
- ALL lowercase, no period at the end. Even component names, file names, proper nouns — everything lowercase in the commit message
- Start with a verb: `add`, `fix`, `replace`, `update`, `remove`, `move`, `split`, `improve`
- Use `add` for wholly new things, `update` for enhancements, `fix` for bugs
- Be specific about what changed, not vague: `add zone filtering` not `update properties`
- Keep it concise — under 72 chars
- Can mention multiple things with `+` when tightly coupled: `add floor support`

## Examples from this repo (mandatory reference — this is exactly how every commit must look)

```
refactor: extract s3 storage api into reusable unit
refactor(infra): reorganize gatus groups to mirror docker stacks
chore(deploy): update image manifest [skip ci]
feat: extract button styles into css file
fix(infra): use node for tileserver healthcheck (no curl/wget in image)
fix(infra): bump planetiler heap to 4g for argentina boundaries
chore: add download argentina tiles script
fix(infra): copy tsconfig into production image for tsx path resolution
feat(business): add marketing and product routes
fix(scheduler): rewrite backup jobs to avoid ofelia INI parser bug
chore: update env vars
docs: add pitch deck, landing copy, pricing, functionalities and terms of service
feat: update server auth + object store + add display escalation utility
refactor: restructure routes into (centered) layout + remove old property pages
feat: add new ui components + update existing for redesign
feat(design): add icon components for bell, chevron, google and habita brand
feat(design): add dm sans fonts + redesign style tokens and typography
feat(infra): add geo tile server config + update gateway and storage
feat: redesign profile page for (centered) layout and fix type errors
docs(skill): add lib utilities
refactor: replace minio with rustfs
refactor(notifications): use satisfies for compile-time type safety on emitted event
chore: add satisfies vs v.parse guideline to data validation skill
feat(notifications): push full notification via sse instead of refetching
feat(e2e): add per-test cleanup for idempotent test runs
feat(resilience): handle object store delete failures with requeue + imgproxy fallback placeholder
feat(notifications): add real-time push via sse + self-contained notification component
feat(infra): split consumer into three separate services by domain
feat(broker): add exponential backoff to consumer retries + functional header composition
feat(security): add redis-based rate limiting per route
feat(db): add explicit pool config + remove redundant query logging
feat(subscription): cache subscriptions in kv with 24h ttl + invalidation on mutation
fix(booking): prevent double-booking with optimistic lock on slot state
feat(property): add floor support
feat: replace blob storing with object store + refactor upsert file
feat: separate stateful services into their own storage service
feat: improve dco bin + add just db commands
chore: move config files to config folder + symlink script
feat(chat): add desriptions + chatbot route
feat(broker): add consumer + producer + events for emails and others
feat: add tenant type in onbaroding + lazy fix for development
feat: add payment wall
fix(properties): zone search works with spanish special characters
style: apply formatting
feat(properties): add zone table + filtering system using zone
fix: return verify certificate action data
feat: add info logging in key flows
feat: implement robust error handling pattern
feat(seeding): add tags to each created property
feat(properties): add tag system for filtering + range for min/max
feat(signature): add actions + lib file
feat(auth): improved drastically how the property access work
feat(e2e): add many many test cases + remove tailwind + better skills
feat(contract): add 3 types of warranty and include in generated pdf
```

## No trailers

Never append `Co-Authored-By`, `Signed-off-by`, or any other trailer to commit messages. Keep messages clean — just the `type(scope): description` line.

## What NOT to do

```bash
# WRONG — vague description
feat: update stuff

# WRONG — uppercase or period
Feat: Add new feature.

# WRONG — scope is a file path
feat(src/lib/components): add button

# WRONG — missing verb
feat: notification system

# WRONG — trailer appended
feat: add button
Co-Authored-By: ...

# WRONG — multi-line message with body
refactor: make Tab a styled wrapper that accepts children

Tab is now a <div> that handles styling. The caller decides the inner
element — <a> for navigation, <button> for interaction.
```
