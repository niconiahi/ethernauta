[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eip&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/eip&treeshake=[*])

## Philosophy

This module ships implementations of Ethereum Improvement Proposals that aren't part of the base JSON-RPC surface — wallet-interaction methods and provider discovery. Each EIP lives in its own subpath so consumers only pay for what they import.

## Currently supports

- [x] [EIP-1102](https://eips.ethereum.org/EIPS/eip-1102) — `eth_requestAccounts` against the wallet
- [x] [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) — Ethereum provider interface
- [x] [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) — multi-injected provider discovery

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### EIP-1102 — request accounts

```ts
import { eth_requestAccounts } from "@ethernauta/eip/1102"
import { signer, SEPOLIA_CHAIN_ID } from "./signer"

const [account] = await eth_requestAccounts()(
  signer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

`eth_requestAccounts` is a `Signable<string[]>` — it bridges to the wallet extension via `window.postMessage` and resolves with the list of authorized addresses.

### EIP-1193 — provider

```ts
import { create_provider } from "@ethernauta/eip/1193"
import { http } from "@ethernauta/transport"

const provider = create_provider({
  chains: [
    {
      chainId: SEPOLIA_CHAIN_ID,
      transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
    },
  ],
})

const chain_id = await provider.request({ method: "eth_chainId" })
```

`create_provider` returns an object that satisfies the EIP-1193 `Provider` interface — `request({ method, params })`, plus `on(event, listener)` / `removeListener`.

### EIP-6963 — multi-injected provider discovery

```ts
import {
  ANNOUNCE_EVENT,
  type EIP6963AnnounceProviderEvent,
  REQUEST_EVENT,
} from "@ethernauta/eip/6963"

window.addEventListener(ANNOUNCE_EVENT, (event) => {
  const { info, provider } = (
    event as EIP6963AnnounceProviderEvent
  ).detail
  // info: { uuid, name, icon, rdns }
  // provider: EIP-1193 Provider
})

window.dispatchEvent(new Event(REQUEST_EVENT))
```

The package exports the event-name constants (`ANNOUNCE_EVENT`, `REQUEST_EVENT`) and the typed event interfaces (`EIP6963ProviderInfo`, `EIP6963ProviderDetail`, `EIP6963AnnounceProviderEvent`, `EIP6963RequestProviderEvent`).

## Files to pay attention

- [1102/method/eth_requestAccounts.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eip/src/1102/method/eth_requestAccounts.ts)
- [1193/index.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eip/src/1193/index.ts)
- [6963/index.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/eip/src/6963/index.ts)
