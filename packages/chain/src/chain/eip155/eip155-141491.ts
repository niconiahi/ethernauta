// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_141491 = {
  name: "Bitharvest Chain Testnet",
  shortName: "BitharvestTestnet",
  chain: "Bitharvest Chain Testnet",
  icon: "bth",
  rpc: ["https://rpc-testnet.bthscan.io/"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Bitharvest Testnet Native Token",
    symbol: "BTH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 141491,
  networkId: 141491,
  explorers: [
    {
      name: "Bitharvest Testnet Scan",
      url: "https://testnet.bthscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
