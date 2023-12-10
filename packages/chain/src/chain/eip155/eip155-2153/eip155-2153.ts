import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2153: Chain = {
  name: "Findora Testnet",
  shortName: "findora-testnet",
  chain: "Testnet-anvil",
  rpc: [
    "https://prod-testnet.prod.findora.org:8545/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "FRA",
    symbol: "FRA",
    decimals: 18,
  },
  infoURL: "https://findora.org/",
  chainId: 2153,
  networkId: 2153,
  explorers: [
    {
      name: "findorascan",
      url: "https://testnet-anvil.evm.findorascan.io",
      standard: "EIP3091",
    },
  ],
}
