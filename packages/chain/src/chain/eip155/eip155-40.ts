// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_40 = {
  name: "Telos EVM Mainnet",
  shortName: "TelosEVM",
  chain: "TLOS",
  rpc: [
    "https://rpc.telos.net",
    "https://telos.drpc.org",
    "wss://telos.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Telos",
    symbol: "TLOS",
    decimals: 18,
  },
  infoURL: "https://telos.net",
  chainId: 40,
  networkId: 40,
  explorers: [
    {
      name: "teloscan",
      url: "https://teloscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
