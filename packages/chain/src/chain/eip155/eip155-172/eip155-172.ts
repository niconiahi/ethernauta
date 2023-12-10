import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_172: Chain = {
  name: "Latam-Blockchain Resil Testnet",
  shortName: "resil",
  chain: "Resil",
  rpc: [
    "https://rpc.latam-blockchain.com",
    "wss://ws.latam-blockchain.com",
  ],
  faucets: [
    "https://faucet.latam-blockchain.com",
  ],
  nativeCurrency: {
    name: "Latam-Blockchain Resil Test Native Token",
    symbol: "usd",
    decimals: 18,
  },
  infoURL: "https://latam-blockchain.com",
  chainId: 172,
  networkId: 172,
}
