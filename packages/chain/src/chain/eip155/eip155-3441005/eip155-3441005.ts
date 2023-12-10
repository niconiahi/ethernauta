import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3441005: Chain = {
  name: "Manta Pacific Testnet",
  shortName: "mantaTestnet",
  chain: "Manta Pacific",
  icon: "manta",
  rpc: [
    "https://manta-testnet.calderachain.xyz/http",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Manta",
    symbol: "MANTA",
    decimals: 18,
  },
  infoURL: "https://manta-testnet.caldera.dev/",
  chainId: 3441005,
  networkId: 3441005,
  explorers: [
    {
      name: "manta-testnet Explorer",
      url: "https://manta-testnet.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
}
