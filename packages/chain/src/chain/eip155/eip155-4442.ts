import type { Chain } from "../shared"

export const eip155_4442 = {
  name: "Denergy Testnet",
  shortName: "den-testnet",
  chain: "DEN",
  icon: "denergy",
  rpc: ["https://rpc.denergytestnet.com/"],
  faucets: [],
  nativeCurrency: {
    name: "WATT",
    symbol: "WATT",
    decimals: 18,
  },
  infoURL: "https://d.energy/",
  chainId: 4442,
  networkId: 4442,
  explorers: [
    {
      name: "Denergy Explorer",
      url: "https://explorer.denergytestnet.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
