# Plans

Long-form design rationale, decision logs, and session-to-session handoff
notes for non-trivial bodies of work. Each subfolder is one plan —
typically a feature pass that spans several PRs and needs more depth than
a commit message or a GitHub issue can carry.

## Why this folder exists alongside the GitHub Project

GitHub Projects (the kanban board attached to this repo) is the
**tracking** surface: which slice is todo / in-flight / done, who owns it,
which PR closes it. Cards are short — title, status, assignee, links.

This folder is the **design** surface: the dense parts that don't fit on
a kanban card.

- Decision IDs (`D1-1`, `D5-3`, …) with the reasoning behind each
  choice, the alternatives that were rejected, and what would have to
  shift to reverse the call.
- Sub-surface breakdowns and sequencing graphs.
- A `Resume pointer` section at the bottom of each plan's `README.md` —
  the canonical "what's done / what's next / what to read first"
  paragraph that lets a fresh session pick up cold.
- Per-PR decisions to carry forward (so PR4 doesn't relitigate what PR2
  already settled).
- A `CHANGELOG.md` mirroring what landed per commit, for cross-session
  continuity.

## Convention

Each kanban card on the GitHub Project links to the relevant plan
folder. The card carries the headline ("PR3: chain coverage expansion");
the linked plan folder carries the why, the rejected alternatives, and
the decisions made along the way.

When a plan finishes, the folder stays — the `Resume pointer` flips to
🟢 complete and the decision log becomes the durable record of why
things look the way they do. Future plans cross-reference past ones by
folder name.

## File shape (per plan)

```
plans/<name>/
  README.md     — design doc + Resume pointer + Implementation log
  CHANGELOG.md  — per-commit baton (what landed, decisions made)
  NOTES.md      — overflow: deferred-design tracking, rabbit holes
```

`NOTES.md` is optional — only some plans accumulate enough deferral or
rabbit-hole material to need it.

## Naming

Lowercase snake_case, descriptive. `op_completeness_pass`, not
`OP-Completeness-Pass` or `op-completeness-pass-v2`. Phase numbers go on
the folder only when sequencing matters across plans
(`02_op_package`, `03_arbitrum_package`).

## What does NOT belong here

- Published documentation — that's `docs/content/` (the SvelteKit docs
  site).
- One-off scratch notes — keep those in your own scratchpad, not the
  repo.
- Pre-commit drafts and AI prompt fragments — keep those in
  `tmp/plans/` (gitignored).

A plan earns its place in this folder when it's substantial enough that
a contributor coming in cold needs the design rationale to make changes
safely.
