// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_14235 = {
  name: "Bitlazer",
  shortName: "bitlazer",
  chain: "bitlazer",
  icon: "bitlazer",
  rpc: ["https://bitlazer.calderachain.xyz/http"],
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
    name: "lzrBTC",
    symbol: "lzrBTC",
    decimals: 18,
  },
  infoURL: "https://bitlazer.hub.caldera.xyz",
  chainId: 14235,
  networkId: 14235,
  explorers: [
    {
      name: "Bitlazer Caldera Explorer",
      url: "https://bitlazer.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
