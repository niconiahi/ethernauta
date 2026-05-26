---
title: Installation
section: Getting Started
section_order: 1
order: 2
---

# Installation

Install only the packages you need. Each package is independently versioned and tree-shakeable.

```bash
pnpm add @ethernauta/core @ethernauta/transport @ethernauta/eth
```

For ERC token method bindings:

```bash
pnpm add @ethernauta/erc
```

For EIP standards (1193, 5792, 6963, ...):

```bash
pnpm add @ethernauta/eip
```

## Peer requirements

- TypeScript 5.x
- An ES2022 runtime (modern browsers, Node 20+, Bun, Cloudflare Workers)
