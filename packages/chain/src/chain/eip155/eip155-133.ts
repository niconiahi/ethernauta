// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_133 = {
  name: "HashKey Chain Testnet",
  shortName: "HSKT",
  title: "HashKey Chain Testnet",
  chain: "HashKey Chain Testnet",
  rpc: ["https://hashkeychain-testnet.alt.technology"],
  faucets: [],
  nativeCurrency: {
    name: "HashKey EcoPoints",
    symbol: "HSK",
    decimals: 18,
  },
  infoURL: "https://hashkey.cloud",
  chainId: 133,
  networkId: 133,
  explorers: [
    {
      name: "blockscout",
      url: "https://hashkeychain-testnet-explorer.alt.technology",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
} satisfies Chain
