// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8408 = {
  name: "ZenChain Testnet",
  shortName: "zentest",
  chain: "ZTC",
  icon: "zenchain",
  rpc: [
    "https://zenchain-testnet.api.onfinality.io/public",
    "wss://zenchain-testnet.api.onfinality.io/public-ws",
  ],
  faucets: ["https://facuet.zenchain.io"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "ZTC",
    symbol: "ZTC",
    decimals: 18,
  },
  infoURL: "https://zenchain.io",
  chainId: 8408,
  networkId: 8408,
  slip44: 60,
  explorers: [
    {
      name: "zentrace",
      url: "https://zentrace.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
