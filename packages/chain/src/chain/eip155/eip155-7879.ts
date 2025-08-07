// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7879 = {
  name: "Vexon Testnet",
  shortName: "vexon",
  chain: "Vexon",
  icon: "vexon",
  rpc: [
    "https://rpc-testnet-asia1.vexonhub.org",
    "https://rpc-testnet-europe1.vexonhub.org",
    "https://rpc-testnet-01.vexonhub.org",
  ],
  faucets: ["https://faucet-drip.vexonhub.org"],
  nativeCurrency: {
    name: "Vexon Testnet Native Token",
    symbol: "tVEX",
    decimals: 18,
  },
  infoURL: "https://vexonhub.org",
  chainId: 7879,
  networkId: 7879,
  explorers: [
    {
      name: "Vexon Testnet Explorer",
      url: "https://testnet.vexonhub.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
