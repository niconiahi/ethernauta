import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_125: Chain = {
  name: "OYchain Testnet",
  shortName: "OYchainTestnet",
  chain: "OYchain",
  rpc: [
    "https://rpc.testnet.oychain.io",
  ],
  faucets: [
    "https://faucet.oychain.io",
  ],
  nativeCurrency: {
    name: "OYchain Token",
    symbol: "OY",
    decimals: 18,
  },
  infoURL: "https://www.oychain.io",
  chainId: 125,
  networkId: 125,
  slip44: 125,
  explorers: [
    {
      name: "OYchain Testnet Explorer",
      url: "https://explorer.testnet.oychain.io",
      standard: "none",
    },
  ],
}
