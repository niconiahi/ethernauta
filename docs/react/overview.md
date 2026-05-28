---
title: "@ethernauta/react"
section: Overview
section_order: 7
order: 10
---

# @ethernauta/react

React hooks for consuming EIP-1193 providers via Ethernauta's resolver shapes. Two hooks, both bound by a caller-owned **storage key** so multi-wallet selection persists across reloads.

```bash
pnpm add @ethernauta/react
```

The library deliberately doesn't ship per-method hooks (`useBalance`, `useEnsName`, …). The resolver shapes compose with React Query / SWR / TanStack Query trivially and reinventing them inside this package would add a maintenance surface for no gain.

## useProvider

Returns a `Provider` — the dapp-side resolver pair (`reader`, `signer`) **already wrapped around the EIP-1193 provider** persisted under `key`, plus the originating `provider_detail` (so you can read `info.name`, `info.icon`).

Returns `null` until the EIP-6963 announce dance resolves the persisted wallet.

```tsx
import { useProvider } from "@ethernauta/react";
import { eth_getBalance } from "@ethernauta/eth";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "@ethernauta/core";

function Balance({ address }: { address: Address }) {
  const provider = useProvider({ key: "wallet" });

  const { data: balance } = useQuery({
    queryKey: ["balance", address],
    queryFn: () => {
      if (!provider) throw new Error("no provider");
      return eth_getBalance([address, "latest"])(
        provider.reader({ chain_id: "eip155:1" }),
      );
    },
    enabled: !!provider,
  });

  if (!provider) return <p>Connecting…</p>;
  return <p>{balance?.toString() ?? "—"}</p>;
}

void Balance;
```

You can read the metadata of the selected wallet:

```tsx
import { useProvider } from "@ethernauta/react";

function WalletInfo() {
  const provider = useProvider({ key: "wallet" });
  if (!provider) return null;
  const name = provider.provider_detail.info.name;   // e.g. "Ethernauta"
  const icon = provider.provider_detail.info.icon;   // base64 / SVG / URL
  const rdns = provider.provider_detail.info.rdns;   // e.g. "io.ethernauta"
  return <p>{name} {icon} {rdns}</p>;
}

void WalletInfo;
```

### Arguments

```ts ignore
useProvider({ key, store? }): Provider | null
```

| Arg | Type | Purpose |
|---|---|---|
| `key` | `string` | Storage key under which the user's wallet selection is persisted. |
| `store` | `Store` (optional) | Override the storage backend. Defaults to `web_storage(window.localStorage)`. |

The `Provider` shape:

```ts
import type { Provider } from "@ethernauta/react";

// Provider is structurally:
//   ProviderResolver & { provider_detail: EIP6963ProviderDetail }
declare const _example: Provider;
void _example;
```

## useProviderDetail

The lower-level hook. Returns just the `EIP6963ProviderDetail` (info + raw 1193 provider) — without wrapping in resolver shapes. Useful when you need the raw provider for `watch_accounts` / `watch_chain` event subscriptions.

```tsx
import { useProviderDetail } from "@ethernauta/react";
import { watch_accounts } from "@ethernauta/eip/1193";
import { useEffect } from "react";

function AccountWatcher() {
  const provider_detail = useProviderDetail({ key: "wallet" });

  useEffect(() => {
    if (!provider_detail) return;
    return watch_accounts(provider_detail.provider, (accounts) => {
      console.log("now exposed:", accounts);
    });
  }, [provider_detail]);

  return null;
}

void AccountWatcher;
```

### Arguments

```ts ignore
useProviderDetail({ key, store? }): EIP6963ProviderDetail | null
```

Same shape as `useProvider`. Internally, `useProvider` composes `useProviderDetail` with `create_provider`.

## Why the `key` argument

EIP-6963 announces *every installed wallet*. The user picks one. That choice gets persisted under a storage key the dapp owns. The next time the page loads, the hook reads back the persisted `rdns`, waits for that wallet to re-announce, and yields its provider.

The `key` lets one dapp persist multiple selections (e.g. a `signer` wallet and a `viewer` wallet) without collision. Most dapps use a single key (`"wallet"`).

## Picking which wallet to persist

`useProvider` and `useProviderDetail` are **read** hooks — they yield whatever's persisted. To **set** the persisted selection (the wallet picker UI), use the lower-level `set_provider_detail` / `clear_provider_detail` from `@ethernauta/eip/6963` directly:

```tsx
import {
  discover_providers,
  set_provider_detail,
  web_storage,
  type EIP6963ProviderDetail,
} from "@ethernauta/eip/6963";

const store = web_storage(localStorage);

async function show_picker() {
  const providers = await discover_providers();
  const chosen_detail: EIP6963ProviderDetail | undefined = providers[0];
  if (!chosen_detail) return;
  // render a UI; on user pick:
  set_provider_detail({ store, key: "wallet", provider_detail: chosen_detail });
}

void show_picker;
```

Once persisted, `useProvider({ key: "wallet" })` starts yielding the wrapped resolver.

## Composing with React Query

```tsx
import { useProvider } from "@ethernauta/react";
import { eth_getBalance } from "@ethernauta/eth";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "@ethernauta/core";

function Balance({ address }: { address: Address }) {
  const provider = useProvider({ key: "wallet" });

  const { data } = useQuery({
    queryKey: ["balance", address, 1],
    queryFn: () => {
      if (!provider) throw new Error("no provider");
      return eth_getBalance([address, "latest"])(
        provider.reader({ chain_id: "eip155:1" }),
      );
    },
    enabled: !!provider,
  });

  return <p>{data?.toString() ?? "—"}</p>;
}

void Balance;
```

The hook is one line. The cache layer is whatever you already use.

## Surface

| Export | Returns | Purpose |
|---|---|---|
| `useProvider({ key, store? })` | `Provider \| null` | Wrapped resolver pair + originating detail. |
| `useProviderDetail({ key, store? })` | `EIP6963ProviderDetail \| null` | Raw detail. |
| `Provider` | type | `ProviderResolver & { provider_detail }`. |

## See also

- [EIP-6963](/eips/6963) — provider discovery, `set_provider_detail`.
- [EIP-1193](/eips/1193) — the underlying provider envelope.
- [@ethernauta/transport → create_provider](/transport/overview) — what `useProvider` wraps internally.
- [Guide → React integration](/guides/react-integration).
- [Guide → multi-wallet via EIP-6963](/guides/multi-wallet).
