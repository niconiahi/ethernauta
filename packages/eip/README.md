[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/eip&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/eip&treeshake=[*])

## Philosophy

This module ships implementations of Ethereum Improvement Proposals that aren't part of the base JSON-RPC surface — wallet-interaction methods, signature formats, provider discovery. Each EIP lives in its own subpath so consumers only pay for what they import. Cross-spec compositions (e.g. EIP-191 + EIP-1271 + EIP-6492 verification) live in [`@ethernauta/crypto`](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto).

## Currently supports

- [x] [EIP-55](https://eips.ethereum.org/EIPS/eip-55) — mixed-case checksum addresses
- [x] [EIP-191](https://eips.ethereum.org/EIPS/eip-191) — `personal_sign` signed data standard
- [x] [EIP-712](https://eips.ethereum.org/EIPS/eip-712) — typed structured data signing
- [x] [EIP-1014](https://eips.ethereum.org/EIPS/eip-1014) — `CREATE2` address derivation
- [x] [EIP-1102](https://eips.ethereum.org/EIPS/eip-1102) — `eth_requestAccounts`
- [x] [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) — Ethereum provider interface
- [x] [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) — smart-contract signature verification
- [x] [EIP-2255](https://eips.ethereum.org/EIPS/eip-2255) — wallet permissions
- [x] [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) — `wallet_addEthereumChain`
- [x] [EIP-3326](https://eips.ethereum.org/EIPS/eip-3326) — `wallet_switchEthereumChain`
- [x] [EIP-4337](https://eips.ethereum.org/EIPS/eip-4337) — account-abstraction primitives (EntryPoint v0.7)
- [x] [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) — Sign-In with Ethereum (SIWE)
- [x] [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) — blob transactions, KZG commitments
- [x] [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) — `wallet_sendCalls` / `wallet_getCallsStatus`
- [x] [EIP-6492](https://eips.ethereum.org/EIPS/eip-6492) — signatures for predeploy contracts
- [x] [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) — multi-injected provider discovery
- [x] [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) — set-code transactions for EOAs

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

### EIP-55 — checksum addresses

```ts
import { to_checksum_address } from "@ethernauta/eip/55"

const display = to_checksum_address("0x52908400098527886e0f7030069857d2e4169ee7")
// "0x52908400098527886E0F7030069857D2E4169EE7"
```

### EIP-191 — personal_sign

```ts
import {
  build_personal_message,
  build_personal_message_hex,
  personal_sign,
} from "@ethernauta/eip/191"

const message_bytes = build_personal_message("hello") // raw 0x19-prefixed bytes
const message_hex = build_personal_message_hex("hello")

// `personal_sign` is a Signable<Bytes65> — bridges to the wallet
const signature = await personal_sign([message_hex, address])(
  signer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### EIP-712 — typed-data signing

```ts
import { hash_typed_data, sign_typed_data, TypedDataSchema } from "@ethernauta/eip/712"

const digest = hash_typed_data({ domain, types, primaryType, message })

// `sign_typed_data` is a Signable<Bytes65>
const signature = await sign_typed_data([address, typed_data])(
  signer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### EIP-1014 — CREATE2

```ts
import { deploy_contract, get_contract_address, get_create2_address } from "@ethernauta/eip/1014"

const contract_address = get_create2_address({
  deployer: "0x…",
  salt: "0x…",
  init_code: "0x…",
})
const eoa_create_address = get_contract_address({ sender, nonce })
const signed = await deploy_contract({ salt, init_code })(signer({ chain_id }))
```

### EIP-1102 — request accounts

```ts
import { eth_requestAccounts } from "@ethernauta/eip/1102"

const [account] = await eth_requestAccounts()(
  signer({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### EIP-1193 — provider

```ts
import {
  create_provider, type Provider,
  create_emitter, type Emitter, type EventName, type EventMap,
  ERROR_CODE, user_rejected, unauthorized, unsupported_method,
  unrecognized_chain, disconnected, chain_disconnected, provider_error, invalid_params,
  watch_accounts, watch_chain,
} from "@ethernauta/eip/1193"

const provider = create_provider({
  request: async ({ method, params }) => {
    // route the call to the appropriate Ethernauta primitive
  },
})

provider.on("accountsChanged", (accounts) => { /* … */ })

// Dapp-side convenience watchers — polling + de-dupe wrappers
const unwatch = watch_accounts(provider, (accounts) => { /* … */ })
```

The package also exports the typed error helpers (`user_rejected`, `unauthorized`, `unsupported_method`, `unrecognized_chain`, `disconnected`, `chain_disconnected`, `provider_error`, `invalid_params`) and the matching `ProviderRpcError` / `ErrorCode` types.

### EIP-1271 — contract signature verification

```ts
import { MAGIC_VALUE, verify_hash } from "@ethernauta/eip/1271"

const ok = await verify_hash({
  address: "0x…contract…",
  hash: "0x…",
  signature: "0x…",
})(reader({ chain_id }))
// `verify_hash` returns true iff isValidSignature(...) === MAGIC_VALUE
```

For the full router that handles EOA + contract + counterfactual, see [`@ethernauta/crypto`](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto).

### EIP-2255 — wallet permissions

```ts
import {
  wallet_getPermissions,
  wallet_requestPermissions,
  type Permission, type Caveat, type RequestedPermissions,
} from "@ethernauta/eip/2255"

const permissions = await wallet_getPermissions()(signer({ chain_id }))
const granted = await wallet_requestPermissions([{ eth_accounts: {} }])(signer({ chain_id }))
```

### EIP-3085 / EIP-3326 — chain management

```ts
import { wallet_addEthereumChain } from "@ethernauta/eip/3085"
import { wallet_switchEthereumChain } from "@ethernauta/eip/3326"

await wallet_addEthereumChain([{
  chainId: "0xaa36a7",
  chainName: "Sepolia",
  rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
  nativeCurrency: { name: "Sepolia ETH", symbol: "SEP", decimals: 18 },
}])(signer({ chain_id }))

await wallet_switchEthereumChain([{ chainId: "0xaa36a7" }])(signer({ chain_id }))
```

### EIP-4337 — account abstraction

```ts
import {
  ENTRY_POINT_V06_ADDRESS,
  ENTRY_POINT_V07_ADDRESS,
  eth_estimateUserOperationGas,
  eth_getUserOperationByHash,
  eth_getUserOperationReceipt,
  eth_sendUserOperation,
  eth_supportedEntryPoints,
  get_user_op_hash,
  inner_user_op_hash,
  pack_user_operation, pack_account_gas_limits, pack_gas_fees,
  pack_init_code, pack_paymaster_and_data, unpack_uint128_pair,
  sign_user_op,
  type UserOperation, type PackedUserOperation,
  type UserOperationByHash, type UserOperationReceipt,
  type EstimateUserOperationGasResult,
} from "@ethernauta/eip/4337"
```

### EIP-4361 — Sign-In with Ethereum

```ts
import {
  build_siwe_message,
  generate_siwe_nonce,
  parse_siwe_message,
  is_siwe_message,
  type SiweMessage,
} from "@ethernauta/eip/4361"

const nonce = generate_siwe_nonce()
const message = build_siwe_message({
  domain: "example.com",
  address: "0x…",
  uri: "https://example.com",
  version: "1",
  chainId: 1,
  nonce,
  issuedAt: new Date().toISOString(),
})
```

The cross-spec verifier (`verify_siwe_message` — parse + EIP-191 + EIP-1271/6492 check) lives in [`@ethernauta/crypto`](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto).

### EIP-4844 — blob transactions

```ts
import {
  to_blobs, from_blobs,
  commitment_to_versioned_hash,
  fake_exponential, get_blob_gasprice,
  BLOB_TX_TYPE, GAS_PER_BLOB, MAX_BLOBS_PER_BLOCK,
  type Blob, type BlobSidecar,
  type KzgCommitment, type KzgProof, type BlobVersionedHash,
} from "@ethernauta/eip/4844"

const blobs = to_blobs(payload)
const versioned = commitment_to_versioned_hash(commitment)
```

A pure-TS KZG implementation (Solidity-compatible commitment / proof primitives) is exported alongside — `blob_to_kzg_commitment`, `compute_kzg_proof`, `compute_blob_kzg_proof`, `verify_kzg_proof`, `verify_blob_kzg_proof`, `verify_blob_kzg_proof_batch`, plus the underlying field / polynomial / setup helpers.

### EIP-5792 — batched calls

```ts
import {
  wallet_sendCalls,
  wallet_getCallsStatus,
  wallet_getCapabilities,
  CALLS_STATUS, type CallsStatusCode,
  type SendCallsParameters, type CallsReceipt, type Capabilities,
} from "@ethernauta/eip/5792"

const { id } = await wallet_sendCalls([{
  version: "1.0",
  from: account,
  chainId: "0xaa36a7",
  calls: [{ to: "0x…", value: "0x0", data: "0x…" }],
}])(signer({ chain_id }))

const status = await wallet_getCallsStatus([id])(signer({ chain_id }))
```

### EIP-6492 — signatures for predeploy contracts

```ts
import {
  MAGIC_BYTES,
  VALIDATOR_BYTECODE,
  is_wrapped_signature,
  wrap_signature, unwrap_signature, type UnwrappedSignature,
  verify_hash,
} from "@ethernauta/eip/6492"

if (is_wrapped_signature(sig)) {
  const { signer_address, factory, factory_calldata, inner_signature } = unwrap_signature(sig)
}
```

### EIP-6963 — multi-injected provider discovery

```ts
import {
  ANNOUNCE_EVENT, REQUEST_EVENT,
  type EIP6963ProviderDetail, type EIP6963ProviderInfo,
  type EIP6963AnnounceProviderEvent, type EIP6963RequestProviderEvent,
  announce, discover_providers, pick_provider,
  web_storage, type Store,
  set_provider_detail, clear_provider_detail, get_provider_detail,
} from "@ethernauta/eip/6963"

// Wallet side
announce({ info: { uuid, name, icon, rdns }, provider })

// Dapp side
const providers = await discover_providers({ ms: 100 })
const wallet = await pick_provider("io.ethernauta")

// Persist a picked wallet across reloads
const store = web_storage(window.localStorage)
set_provider_detail({ store, key: "ethernauta:picked", provider_detail: wallet })
const rehydrated = await get_provider_detail({ store, key: "ethernauta:picked" })
```

### EIP-7702 — set-code transactions

```ts
import {
  SET_CODE_TX_TYPE, SET_CODE_MAGIC,
  build_authorization_message, hash_authorization,
  is_delegation_designator,
  sign_authorization, sign_set_code_transaction,
  encode_set_code_signed, encode_set_code_unsigned,
  wallet_sendSetCodeTransaction, wallet_signAuthorization,
  type AuthorizationParameter, type AuthorizationSigned, type AuthorizationList,
  type DelegationIntent, type SendSetCodeTransactionParameters,
  type AccessListItem, type SetCodeTransactionSigned, type SetCodeTransactionUnsigned,
} from "@ethernauta/eip/7702"
```
