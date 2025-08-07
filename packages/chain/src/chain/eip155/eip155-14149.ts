// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_14149 = {
  name: "Bitharvest Chain Mainnet",
  shortName: "BitharvestMainnet",
  chain: "Bitharvest Chain Mainnet",
  icon: "bth",
  rpc: ["https://rpc.bthscan.io/"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Bitharvest Mainnet Native Token",
    symbol: "BTH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 14149,
  networkId: 14149,
  explorers: [
    {
      name: "Bitharvest Mainnet Scan",
      url: "https://bthscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
