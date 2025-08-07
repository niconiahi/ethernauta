// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1918 = {
  name: "UPB CRESCDI Testnet",
  shortName: "UPBEth",
  chain: "UPBEth",
  rpc: ["https://testnet.crescdi.pub.ro"],
  faucets: [],
  nativeCurrency: {
    name: "UPBEth",
    symbol: "UPBEth",
    decimals: 18,
  },
  infoURL:
    "https://mobylab.docs.crescdi.pub.ro/blog/UPB-CRESCDI-Testnet",
  chainId: 1918,
  networkId: 1918,
  explorers: [],
} satisfies Chain
