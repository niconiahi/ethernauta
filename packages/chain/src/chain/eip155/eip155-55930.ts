import type { Chain } from "../shared"

export const eip155_55930 = {
  name: "DataHaven Mainnet",
  shortName: "datahaven",
  chain: "datahaven",
  icon: "datahaven",
  rpc: [
    "https://services.datahaven-mainnet.network/mainnet",
    "wss://services.datahaven-mainnet.network/mainnet",
  ],
  faucets: [],
  nativeCurrency: {
    name: "HAVE",
    symbol: "HAVE",
    decimals: 18,
  },
  infoURL: "https://datahaven.xyz",
  chainId: 55930,
  networkId: 55930,
  explorers: [
    {
      name: "Blockscout",
      url: "https://dhscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
