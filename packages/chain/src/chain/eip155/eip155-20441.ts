// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20441 = {
  name: "XUSD ONE StableChain Mainnet",
  shortName: "xusd",
  chain: "XUSD ONE",
  icon: "xusd",
  rpc: ["https://xusd.live"],
  faucets: [],
  nativeCurrency: {
    name: "XUSD ONE",
    symbol: "X1",
    decimals: 18,
  },
  infoURL: "https://xusd.co",
  chainId: 20441,
  networkId: 20441,
  explorers: [
    {
      name: "xusdscan",
      url: "https://xusdscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
