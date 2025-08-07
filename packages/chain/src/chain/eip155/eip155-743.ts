// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_743 = {
  name: "Tranched Mainnet",
  shortName: "tranched-mainnet",
  chain: "tranched-mainnet",
  icon: "tranched-mainnet",
  rpc: ["https://tranched-mainnet.calderachain.xyz/http"],
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://tranched-mainnet.hub.caldera.xyz",
  chainId: 743,
  networkId: 743,
  explorers: [
    {
      name: "Tranched Mainnet Caldera Explorer",
      url: "https://tranched-mainnet.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
