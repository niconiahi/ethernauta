---
title: Multi-wallet via EIP-6963
section: Guides
section_order: 3
order: 6
---

# Multi-wallet via EIP-6963

Before EIP-6963, dapps assumed `window.ethereum` was the wallet. With multiple wallets installed, that broke — whichever wallet ran last "wins" the `window.ethereum` slot. EIP-6963 specifies a discovery protocol: each wallet announces itself with metadata; dapps listen and pick.

## Discovering providers

```ts
import { discover_providers } from "@ethernauta/eip/6963";

const providers = await discover_providers();
// → EIP6963ProviderDetail[]
// each carrying { info: { rdns, uuid, name, icon }, provider }
void providers;
```

`discover_providers` dispatches the `eip6963:requestProvider` event and collects all announcements that arrive within a short window (default 100ms). By the time it resolves, every installed wallet has had a chance to announce.

## Letting the user pick

The storage operations are keyed — the dapp owns the storage key, which lets one dapp persist multiple selections (e.g. a signer wallet and a viewer wallet) without collision.

```ts
import {
  discover_providers,
  set_provider_detail,
  web_storage,
  type EIP6963ProviderDetail,
} from "@ethernauta/eip/6963";
import type { Provider } from "@ethernauta/eip/1193";

const store = web_storage(localStorage);
const key = "wallet";
const providers: EIP6963ProviderDetail[] = await discover_providers();

declare function render_button(_props: {
  icon: string;
  name: string;
  onClick: () => void;
}): void;
declare function use(_provider: Provider): void;

for (const provider_detail of providers) {
  render_button({
    icon: provider_detail.info.icon,
    name: provider_detail.info.name,
    onClick: () => {
      set_provider_detail({ store, key, provider_detail });
      use(provider_detail.provider);
    },
  });
}
```

`set_provider_detail` writes only the chosen wallet's `rdns` — never the live `Provider` object (it can't be serialized).

## Rehydrating on reload

```ts
import { get_provider_detail, web_storage } from "@ethernauta/eip/6963";

const store = web_storage(localStorage);
const key = "wallet";

const persisted = await get_provider_detail({ store, key });
// → EIP6963ProviderDetail | null
void persisted;
```

`get_provider_detail` is **async** because it re-runs the discovery dance internally — the persisted rdns gets matched against the providers that announce on this page load. If the user uninstalled their previously-picked wallet, the result is `null`.

## The returning-user pattern

```ts
import {
  get_provider_detail,
  discover_providers,
  web_storage,
  type EIP6963ProviderDetail,
} from "@ethernauta/eip/6963";
import type { Provider } from "@ethernauta/eip/1193";

const store = web_storage(localStorage);
const key = "wallet";

declare function use(_provider: Provider): void;
declare function show_wallet_picker(_providers: EIP6963ProviderDetail[]): void;

const persisted = await get_provider_detail({ store, key });

if (persisted) {
  use(persisted.provider);
} else {
  // either first visit, or previously-picked wallet was uninstalled
  const providers = await discover_providers();
  show_wallet_picker(providers);
}
```

`rdns` is the canonical wallet ID (`io.ethernauta`, `io.metamask`, …) and what's used for the persistent identity. `name`, `uuid` can drift.

## Disconnecting

```ts
import { clear_provider_detail, web_storage } from "@ethernauta/eip/6963";

const store = web_storage(localStorage);
const key = "wallet";

clear_provider_detail({ store, key });
```

After this, `get_provider_detail` returns `null` until the user picks again.

## In React

`@ethernauta/react` wraps this entire flow into hooks. `useProvider({ key })` returns the **already-wrapped resolver pair** (`reader`, `signer`) bound to the persisted wallet — no need to call `create_provider` yourself:

```tsx
import type { ReactElement } from "react";
import { useProvider, type Provider } from "@ethernauta/react";

declare function WalletPicker(): ReactElement;
declare function Dapp(_props: { provider: Provider }): ReactElement;

function App() {
  const provider = useProvider({ key: "wallet" });

  if (!provider) {
    return <WalletPicker />;
  }

  return <Dapp provider={provider} />;
}
void App;
```

See [Guide → React integration](/guides/react-integration) for the picker UI and event subscriptions.

## See also

- [EIP-6963](/eips/6963) — full surface.
- [EIP-1193](/eips/1193) — what each announced provider conforms to.
- [@ethernauta/react](/react/overview) — `useProvider`, `useProviderDetail`.
