// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_216 = {
  name: "Happychain Testnet",
  shortName: "happytestnet",
  chain: "Happychain Testnet",
  rpc: ["https://rpc.testnet.happy.tech/http"],
  faucets: [],
  nativeCurrency: {
    name: "Happy",
    symbol: "HAPPY",
    decimals: 18,
  },
  infoURL: "https://testnet.happy.tech",
  chainId: 216,
  networkId: 216,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.testnet.happy.tech",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
