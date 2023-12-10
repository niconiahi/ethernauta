import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2154: Chain = {
  name: "Findora Forge",
  shortName: "findora-forge",
  chain: "Testnet-forge",
  rpc: [
    "https://prod-forge.prod.findora.org:8545/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "FRA",
    symbol: "FRA",
    decimals: 18,
  },
  infoURL: "https://findora.org/",
  chainId: 2154,
  networkId: 2154,
  explorers: [
    {
      name: "findorascan",
      url: "https://testnet-forge.evm.findorascan.io",
      standard: "EIP3091",
    },
  ],
}
