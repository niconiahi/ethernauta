// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_153153 = {
  name: "Odyssey Chain Mainnet",
  shortName: "Odyssey",
  chain: "DIONE",
  icon: "odysseyChain",
  rpc: ["https://node.dioneprotocol.com/ext/bc/D/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "DIONE",
    symbol: "DIONE",
    decimals: 18,
  },
  infoURL: "https://www.dioneprotocol.com",
  chainId: 153153,
  networkId: 153153,
  explorers: [
    {
      name: "Odyssey Scan",
      url: "https://odysseyscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
