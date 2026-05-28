import type { Chain } from "../shared"

export const eip155_369369 = {
  name: "Denergy Network",
  shortName: "den-mainnet",
  chain: "DEN",
  icon: "denergy",
  rpc: ["https://rpc.d.energy/"],
  faucets: [],
  nativeCurrency: {
    name: "WATT",
    symbol: "WATT",
    decimals: 18,
  },
  infoURL: "https://d.energy/",
  chainId: 369369,
  networkId: 369369,
  explorers: [
    {
      name: "Denergy Explorer",
      url: "https://explorer.denergychain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
