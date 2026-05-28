import type { Chain } from "../shared"

export const eip155_55931 = {
  name: "DataHaven Testnet",
  shortName: "datahaven-testnet",
  chain: "datahaven-testnet",
  icon: "datahaven-testnet",
  rpc: [
    "https://services.datahaven-testnet.network/testnet",
    "wss://services.datahaven-testnet.network/testnet",
  ],
  faucets: ["https://apps.datahaven.xyz/faucet"],
  nativeCurrency: {
    name: "MOCK",
    symbol: "MOCK",
    decimals: 18,
  },
  infoURL: "https://datahaven.xyz",
  chainId: 55931,
  networkId: 55931,
  explorers: [
    {
      name: "Blockscout",
      url: "https://testnet.dhscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
