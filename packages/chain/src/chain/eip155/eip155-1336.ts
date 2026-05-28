import type { Chain } from "../shared"

export const eip155_1336 = {
  name: "Kii Testnet Oro",
  shortName: "kiioro",
  chain: "KII",
  icon: "kii",
  rpc: [
    "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com",
  ],
  faucets: ["https://testnet.explorer.kiichain.io/faucet"],
  features: [],
  nativeCurrency: {
    name: "Kii",
    symbol: "KII",
    decimals: 18,
  },
  infoURL: "https://kiichain.io",
  chainId: 1336,
  networkId: 1336,
  explorers: [
    {
      name: "KiiExplorer",
      url: "https://testnet.explorer.kiichain.io",
      standard: "none",
    },
  ],
} satisfies Chain
