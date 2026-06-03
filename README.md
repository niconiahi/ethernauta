![logo](https://github.com/niconiahi/ethernauta/blob/main/assets/logo.svg)

**Ethernauta** is a tree-shakable Ethereum library plus a Chrome MV3 wallet. Every method is a small curried function consumed by one of four resolver shapes (`Readable<T>`, `Writable<T>`, `Signable<T>`, `Callable<T>`) — pay only for what you import, drop in the wallet only when you need to sign.

## Install

```bash
pnpm add @ethernauta/chain @ethernauta/eth @ethernauta/transport
```

## Read the chain in 12 lines

```ts
import { eip155_11155111 } from "@ethernauta/chain"
import { eth_blockNumber } from "@ethernauta/eth"
import { create_reader, encode_chain_id, http } from "@ethernauta/transport"

const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const reader = create_reader([{
  chainId: SEPOLIA,
  transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
}])

const head = await eth_blockNumber()(reader({ chain_id: SEPOLIA }))
```

Signing, writing, contract reads and EIP-6963 wallet discovery follow the same `method(args)(resolver({ chain_id, …ctx }))` shape — see [`@ethernauta/eth`](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) and [`@ethernauta/transport`](https://github.com/niconiahi/ethernauta/tree/main/packages/transport).

## Why Ethernauta

- **Tiny bundles.** Architected per [Valibot's thesis](https://valibot.dev/thesis.pdf) for aggressive tree-shaking — a dapp that only reads `eth_blockNumber` ships almost none of the library.
- **No hosted services, no coordinated rollouts.** Public RPC endpoints, the wallet extension, and dapp code is the entire dependency surface. Adding an EIP / ERC is a folder-shaped operation.
- **ESM-only, Web APIs only.** Runs anywhere the web platform runs — no Node-API leakage, no polyfills.
- **Two consumer paths, both first-class.** Pre-sign and broadcast (`eth_signTransaction` + `eth_sendRawTransaction`, no wallet needed for the broadcast step), or hand the whole flow to the wallet (`eth_sendTransaction`). The library never forces a choice.
- **Standards-compliant by construction.** EIP-1193 / EIP-6963 / EIP-5792 / EIP-7702 — any Ethernauta dapp talks to any standards-compliant wallet, and the Ethernauta wallet serves any standards-compliant dapp.
- **Schemas at every boundary.** Every value crossing a boundary is validated with a Valibot schema. The schema is the type (`type X = InferOutput<typeof xSchema>`).

## What's in the box

| Capability | Package |
| --- | --- |
| 500+ EIP-155 chain consts (CAIP-2 ready) | [`@ethernauta/chain`](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) |
| Every `eth_*` JSON-RPC method, three shapes | [`@ethernauta/eth`](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) |
| Resolver factories + HTTP / WebSocket / Multicall transports + EIP-1193 adapter | [`@ethernauta/transport`](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) |
| EIPs 55 / 191 / 712 / 1014 / 1102 / 1193 / 1271 / 2255 / 3085 / 3326 / 4337 / 4361 / 4844 / 5792 / 6492 / 6963 / 7702 | [`@ethernauta/eip`](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) |
| ERCs 20 / 137 / 165 / 181 / 634 / 721 / 1155 / 1577 / 2304 / 2612 / 2981 / 3156 / 4494 / 4626 / 5564 / 5805 / 6372 / 7683 | [`@ethernauta/erc`](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) |
| ENS resolution + ENSIP-15 normalisation | [`@ethernauta/ens`](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) |
| ABI codec + code generator (`Callable` / `Signable` methods) | [`@ethernauta/abi`](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) |
| CLI — `ethernauta abi` (walker mode), `ethernauta registry` | [`@ethernauta/cli`](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) |
| Cross-spec signature / SIWE verification + key derivation | [`@ethernauta/crypto`](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) |
| Lifecycle tracker (`pending` → `mined` / `reverted`) | [`@ethernauta/transaction`](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) |
| OP-Stack — predeploys, fees, `op-node` RPC, per-chain L1 deploys, deposit / withdraw / prove / execute / get_status bridge verbs | [`@ethernauta/op`](https://github.com/niconiahi/ethernauta/tree/main/packages/op) |
| Arbitrum — 16 precompiles, `arb_*` RPC, orbit registry, L1 deploys, retryable lifecycle + bridge verbs, timeboost | [`@ethernauta/arbitrum`](https://github.com/niconiahi/ethernauta/tree/main/packages/arbitrum) |
| zkSync Era — system contracts, `zks_*` RPC, 0x71 (EIP-712) tx encoder + signer, L1 deploys, deposit / withdraw / claim bridge verbs | [`@ethernauta/zksync`](https://github.com/niconiahi/ethernauta/tree/main/packages/zksync) |
| React hooks (`useProvider`, `useProviderDetail`) | [`@ethernauta/react`](https://github.com/niconiahi/ethernauta/tree/main/packages/react) |
| Chrome MV3 wallet | [`@ethernauta/wallet`](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet) |

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [arbitrum](https://github.com/niconiahi/ethernauta/tree/main/packages/arbitrum) [[NPM](https://www.npmjs.com/package/@ethernauta/arbitrum)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [op](https://github.com/niconiahi/ethernauta/tree/main/packages/op) [[NPM](https://www.npmjs.com/package/@ethernauta/op)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)
- [zksync](https://github.com/niconiahi/ethernauta/tree/main/packages/zksync) [[NPM](https://www.npmjs.com/package/@ethernauta/zksync)]

## A real production dapp: Animatronik

[**Animatronik**](https://github.com/niconiahi/animatronik) is a production NFT dApp built end-to-end on Ethernauta. It uses the ABI generator for [its contract](https://github.com/niconiahi/animatronik/blob/main/contracts/out/AnimatronikContract.sol/AnimatronikContract.json) methods, `create_contract` for view reads, and `create_provider(provider).signer` + `create_writer` for state changes (the `provider` comes from an EIP-6963 announce). The source is the most complete public reference for consuming the library.

## Use Ethernauta with your AI agent

Drop [`skills/ethernauta/SKILL.md`](https://github.com/niconiahi/ethernauta/blob/main/skills/ethernauta/SKILL.md) into your agent's context and it will know — without visiting these docs — how to wire chains, read state, connect a wallet, sign transactions, and call contracts the Ethernauta way. The skill is concept-by-concept (WHAT it is, WHEN to reach for it) and links to a self-contained, copy-pasteable example for every section under [`skills/ethernauta/examples/`](https://github.com/niconiahi/ethernauta/tree/main/skills/ethernauta/examples). Every pattern is lifted from real code in [Animatronik](https://github.com/niconiahi/animatronik) or the in-repo playground — nothing speculative.
