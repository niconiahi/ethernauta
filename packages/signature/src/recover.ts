// Re-export of the ECDSA recover primitive that lives in `@ethernauta/eip/1271`
// (see the long comment there for why). Consumers who think of `recover_address`
// as a generic crypto helper can import it from `@ethernauta/signature` and
// stay unaware of the EIP-1271 routing detail.

export { recover_address } from "@ethernauta/eip/1271"
