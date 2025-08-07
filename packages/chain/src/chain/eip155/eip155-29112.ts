// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_29112 = {
  name: "HYCHAIN Testnet",
  shortName: "hychain-testnet",
  chain: "ETH",
  icon: "hychain",
  rpc: ["https://testnet-rpc.hychain.com/http"],
  faucets: [],
  nativeCurrency: {
    name: "TOPIA",
    symbol: "TOPIA",
    decimals: 18,
  },
  infoURL: "https://www.hychain.com",
  chainId: 29112,
  networkId: 29112,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet.explorer.hychain.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-58008",
    bridges: [],
  },
} satisfies Chain
