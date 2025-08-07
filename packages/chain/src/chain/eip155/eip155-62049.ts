// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_62049 = {
  name: "OPTOPIA Testnet",
  shortName: "OPTOPIA-Testnet",
  chain: "ETH",
  icon: "optopia",
  rpc: ["https://rpc-testnet.optopia.ai"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://optopia.ai",
  chainId: 62049,
  networkId: 62049,
  explorers: [
    {
      name: "optopia-testnet-scan",
      url: "https://scan-testnet.optopia.ai",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge-testnet.optopia.ai",
      },
    ],
  },
} satisfies Chain
