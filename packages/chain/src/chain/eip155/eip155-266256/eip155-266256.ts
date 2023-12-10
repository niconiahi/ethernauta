import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_266256: Chain = {
  name: "Gear Zero Network Testnet",
  shortName: "gz-testnet",
  chain: "GearZero",
  rpc: [
    "https://gzn-test.linksme.info",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Gear Zero Network Native Token",
    symbol: "GZN",
    decimals: 18,
  },
  infoURL: "https://token.gearzero.ca/testnet",
  chainId: 266256,
  networkId: 266256,
  slip44: 266256,
  explorers: [],
}
