// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1174 = {
  name: "Litheum Test Network",
  shortName: "lith",
  chain: "Litheum",
  rpc: ["https://testnet.litheum.com"],
  faucets: [],
  nativeCurrency: {
    name: "Lith",
    symbol: "LTH",
    decimals: 18,
  },
  infoURL: "https://litheum.com",
  chainId: 1174,
  networkId: 1174,
  explorers: [
    {
      name: "Litheum Test Network Explorer",
      url: "https://explorer.litheum.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
