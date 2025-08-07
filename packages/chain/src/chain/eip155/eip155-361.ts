// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_361 = {
  name: "Theta Mainnet",
  shortName: "theta-mainnet",
  chain: "Theta",
  rpc: ["https://eth-rpc-api.thetatoken.org/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Theta Fuel",
    symbol: "TFUEL",
    decimals: 18,
  },
  infoURL: "https://www.thetatoken.org/",
  chainId: 361,
  networkId: 361,
  explorers: [
    {
      name: "Theta Mainnet Explorer",
      url: "https://explorer.thetatoken.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
