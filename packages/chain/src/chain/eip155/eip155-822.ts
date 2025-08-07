// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_822 = {
  name: "Runic Chain Testnet",
  shortName: "runic-testnet",
  chain: "Runic",
  icon: "runic-testnet",
  rpc: ["https://rpc-testnet.runic.build"],
  faucets: ["https://faucet.runic.build"],
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "rBTC",
    decimals: 18,
  },
  infoURL: "https://runic.build",
  chainId: 822,
  networkId: 822,
  explorers: [
    {
      name: "RunicScan",
      url: "https://scan.runic.build",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
