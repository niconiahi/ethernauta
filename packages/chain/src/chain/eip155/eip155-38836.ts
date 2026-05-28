import type { Chain } from "../shared"

export const eip155_38836 = {
  name: "Igra Testnet",
  shortName: "igra-galleon-testnet",
  chain: "IGRA",
  icon: "igra",
  rpc: ["https://galleon-testnet.igralabs.com:8545"],
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
    name: "iKAS",
    symbol: "iKAS",
    decimals: 18,
  },
  infoURL: "https://igralabs.com",
  chainId: 38836,
  networkId: 38836,
  explorers: [
    {
      name: "Igra Galleon Testnet Explorer",
      url: "https://explorer.galleon-testnet.igralabs.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
