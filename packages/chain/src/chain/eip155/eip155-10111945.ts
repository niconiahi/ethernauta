import type { Chain } from "../shared"

export const eip155_10111945 = {
  name: "SATUCHAIN Mainnet",
  shortName: "satumainnet",
  chain: "SATU",
  icon: "satuchain",
  rpc: [
    "https://rpc-mainnet.satuchain.com",
    "https://rpc-indo-mainnet.satuchain.com",
    "wss://rpc-mainnet.satuchain.com/ws",
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
    name: "Satu",
    symbol: "STU",
    decimals: 18,
  },
  infoURL: "https://satuchain.com",
  chainId: 10111945,
  networkId: 10111945,
  explorers: [
    {
      name: "SATUCHAIN Mainnet Explorer",
      url: "https://stuscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
