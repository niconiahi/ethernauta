---
title: "@ethernauta/utils"
section: Overview
section_order: 7
order: 2
---

# @ethernauta/utils

Pure, dependency-free helpers. No side effects, no I/O, no third-party imports. **Hard rule 9 in CLAUDE.md.** This package must stay safe to import from anywhere — workers, edge runtimes, code that runs before any framework boots.

```bash
pnpm add @ethernauta/utils
```

## What's in here

- **Format conversion** between hex, bytes, and numbers.
- **String** transformations (`camel_to_kebab`).
- **RLP** encoding.
- **Time** helpers (deadlines, bigint epochs).
- **Ether-unit** parsing and formatting (`parse_ether`, `format_gwei`, …).
- **Invariant** runtime check.

## Format conversion

```ts
import {
  bytes_to_hex,
  bytes_to_uint,
  hex_to_bytes,
  hex_to_number,
  number_to_hex,
  strip_hex_prefix,
} from "@ethernauta/utils";

bytes_to_hex(new Uint8Array([0xde, 0xad]));       // → "0xdead"
hex_to_bytes("0xdead");                            // → Uint8Array [0xde, 0xad]
number_to_hex(255);                                // → "0xff"
hex_to_number("0xff");                             // → 255
bytes_to_uint(new Uint8Array([0x01, 0x00]));      // → 256n
strip_hex_prefix("0xdeadbeef");                    // → "deadbeef"
```

These are the lowest-level converters every other package relies on. They have **no validation** — pass invalid hex and you get garbage. Use the `@ethernauta/core` schemas if you need to validate first.

## RLP

```ts
import { rlp_encode, type RlpInput } from "@ethernauta/utils";

const encoded = rlp_encode([
  "0x01",                          // nonce
  "0x0f4240",                      // gas price
  "0x5208",                        // gas
  "0x" + recipient_bytes_hex,      // to
  "0x16345785D8A0000",             // value
  "0x",                            // data
]);
```

`RlpInput` is a recursive shape: hex strings, bytes, or arrays of `RlpInput`. Used internally by `@ethernauta/eth`'s transaction encoders. Made available here because RLP is generally useful (other tools, debugging, custom tx types).

## String

```ts
import { camel_to_kebab } from "@ethernauta/utils";

camel_to_kebab("balanceOf");   // → "balance-of"
camel_to_kebab("transferFrom"); // → "transfer-from"
```

Used by the ABI codegen tooling in `@ethernauta/cli` and `@ethernauta/abi/generator` to turn ABI-cased identifiers into kebab-case filenames.

## Time

```ts
import { seconds_to_big, now_to_big, deadline_in } from "@ethernauta/utils";

const epoch_now: bigint = now_to_big();
const five_minutes: bigint = seconds_to_big(300);
const deadline: bigint = deadline_in(300);  // now + 5 minutes, in seconds
```

`bigint` epochs because Solidity and most contract storage uses `uint256` for timestamps. Helpers like `deadline_in` avoid the off-by-one between "JS milliseconds" and "EVM seconds."

## Ether units

```ts
import {
  parse_unit,
  format_unit,
  parse_ether,
  format_ether,
  parse_gwei,
  format_gwei,
} from "@ethernauta/utils";

parse_ether("1.5");           // → 1500000000000000000n
format_ether(1500000000000000000n);  // → "1.5"

parse_gwei("100");            // → 100000000000n
format_gwei(100000000000n);   // → "100"

parse_unit("1.234", 6);       // → 1234000n  (e.g. USDC)
format_unit(1234000n, 6);     // → "1.234"
```

`parse_*` and `format_*` are exact-decimal — there's no floating-point intermediate. `parse_ether("0.1") + parse_ether("0.2") === parse_ether("0.3")` always holds.

## Invariant

```ts
import { invariant } from "@ethernauta/utils";

invariant(value !== null, "value is null at the start of frobnication");
// `value` is narrowed to non-null after this line
```

`invariant` throws when the condition is false. It's a runtime guard that doubles as a TypeScript type narrowing. Use it at interior assumptions that shouldn't be reachable but are worth catching loudly when they are.

Per CLAUDE.md, invariant calls are baseline-gated (Phase 10 locks the count at hard zero — see `scripts/no-escape-hatches.sh`). Adding a new one outside the allow-list will fail the ratchet. Pre-existing ones are the ones you can refer to as examples.

## Why dependency-free matters

If `@ethernauta/utils` imports anything, it stops being safe to consume from:

- Web workers (no `process`, no `Buffer`).
- Cloudflare Workers (no Node built-ins).
- Browser extensions' content scripts (sandboxed contexts).
- Pre-framework boot code (no module bundler runtime).

Keeping the dependency tree empty is what makes this package the universal lowest-level layer. Promotions into here are rare and require justification.

## See also

- [@ethernauta/core](/core/overview) — Valibot primitives (schemas, not converters).
- [@ethernauta/abi](/abi/overview) — codecs (these are higher-level than `rlp_encode`).
