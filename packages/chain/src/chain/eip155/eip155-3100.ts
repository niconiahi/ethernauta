// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3100 = {
  name: "Immu3 EVM",
  shortName: "Immu3",
  chain: "EVMCC",
  rpc: [
    "https://fraa-flashbox-2800-rpc.a.stagenet.tanssi.network",
    "wss://fraa-flashbox-2800-rpc.a.stagenet.tanssi.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "IMMU",
    symbol: "IMMU",
    decimals: 18,
  },
  infoURL: "https://immu3.io",
  chainId: 3100,
  networkId: 3100,
  explorers: [],
} satisfies Chain
