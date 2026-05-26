[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/react&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/react&treeshake=[*])

## Philosophy

This module ships the React hooks that wire an EIP-6963 provider into the Ethernauta resolver shape. Discovery (`eip6963:requestProvider`) and persistence (the user-picked rdns in `localStorage`) happen in `@ethernauta/eip/6963`; this package only adapts those primitives to a React lifecycle.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### `useProviderDetail`

Returns the live `EIP6963ProviderDetail` for the wallet whose rdns is persisted under `key`. Runs the EIP-6963 announce request once on mount; resolves to `null` while in flight or when the wallet did not announce (uninstalled, disabled).

```tsx
import { useProviderDetail } from "@ethernauta/react"

function WalletBadge() {
  const provider_detail = useProviderDetail({ key: "ethernauta:picked" })
  if (!provider_detail) return null
  return (
    <span>
      <img src={provider_detail.info.icon} alt="" />
      {provider_detail.info.name}
    </span>
  )
}
```

A custom storage (e.g. `chrome.storage.session` adapter) can be supplied via the optional `store` argument; the default is `web_storage(window.localStorage)`.

### `useProvider`

Composes `useProviderDetail` with `create_provider` from `@ethernauta/transport` — returns the dapp-side resolver pair (`reader`, `signer`) already wired to the rehydrated EIP-1193 provider, plus the originating detail.

```tsx
import { useProvider } from "@ethernauta/react"
import { eth_chainId } from "@ethernauta/eth"
import { eth_requestAccounts } from "@ethernauta/eip/1102"

function Connect() {
  const provider = useProvider({ key: "ethernauta:picked" })
  if (!provider) return <button>Pick a wallet</button>

  async function connect() {
    if (!provider) return
    const chain_id = await eth_chainId()(provider.reader({ chain_id: SEPOLIA_CHAIN_ID }))
    const [account] = await eth_requestAccounts()(provider.signer({ chain_id }))
  }

  return <button onClick={connect}>{provider.provider_detail.info.name}</button>
}
```

The exported `Provider` type carries both shapes:

```ts
import type { Provider } from "@ethernauta/react"

// {
//   provider_detail: EIP6963ProviderDetail
//   reader: ProviderResolver["reader"]
//   signer: ProviderResolver["signer"]
// }
```
