// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_490000 = {
  name: "Autonomys Taurus Testnet",
  shortName: "ATN",
  chain: "autonomys-taurus-testnet",
  icon: "autonomys",
  rpc: ["https://auto-evm.taurus.autonomys.xyz/ws"],
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
    name: "AI3",
    symbol: "AI3",
    decimals: 18,
  },
  infoURL: "https://www.autonomys.xyz",
  chainId: 490000,
  networkId: 490000,
  explorers: [
    {
      name: "Autonomys Taurus Testnet Explorer",
      url: "https://blockscout.taurus.autonomys.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
