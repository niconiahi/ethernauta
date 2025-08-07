// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2424 = {
  name: "inEVM Testnet",
  shortName: "inevm-testnet",
  chain: "inEVM testnet",
  icon: "inevm",
  rpc: ["https://testnet.rpc.inevm.com/http"],
  faucets: [],
  nativeCurrency: {
    name: "Injective",
    symbol: "INJ",
    decimals: 18,
  },
  infoURL: "https://inevm.com",
  chainId: 2424,
  networkId: 2424,
  explorers: [],
  status: "active",
} satisfies Chain
