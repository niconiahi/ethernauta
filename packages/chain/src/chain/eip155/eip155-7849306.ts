// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7849306 = {
  name: "Ozean Poseidon Testnet",
  shortName: "ozean-poseidon",
  chain: "Ozean Poseidon",
  icon: "ozean",
  rpc: [
    "https://ozean-testnet.rpc.caldera.xyz/http",
    "wss://ozean-testnet.rpc.caldera.xyz/ws",
  ],
  faucets: ["https://ozean-testnet.hub.caldera.xyz"],
  nativeCurrency: {
    name: "USDX",
    symbol: "USDX",
    decimals: 18,
  },
  infoURL: "https://docs.ozean.finance",
  chainId: 7849306,
  networkId: 7849306,
  explorers: [
    {
      name: "Ozean Testnet Explorer",
      url: "https://ozean-testnet.explorer.caldera.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
  status: "active",
} satisfies Chain
