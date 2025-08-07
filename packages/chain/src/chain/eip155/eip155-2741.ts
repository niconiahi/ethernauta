// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2741 = {
  name: "Abstract",
  shortName: "abstract",
  chain: "Abstract",
  icon: "abstract",
  rpc: ["https://api.mainnet.abs.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://abs.xyz",
  chainId: 2741,
  networkId: 2741,
  explorers: [
    {
      name: "Etherscan",
      url: "https://abscan.org",
      standard: "EIP3091",
    },
    {
      name: "Abstract Explorer",
      url: "https://explorer.mainnet.abs.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.mainnet.abs.xyz/bridge",
      },
    ],
  },
} satisfies Chain
