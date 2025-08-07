// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2071 = {
  name: "Metacces Mainnet",
  shortName: "ACCES",
  chain: "Metacces Mainnet",
  icon: "metacces",
  rpc: ["https://oli.accesscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "Metacces",
    symbol: "ACCES",
    decimals: 18,
  },
  infoURL: "https://metacces.com",
  chainId: 2071,
  networkId: 2071,
  explorers: [
    {
      name: "accesscan",
      url: "https://accesscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
