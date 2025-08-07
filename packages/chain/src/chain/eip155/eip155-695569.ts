// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_695569 = {
  name: "Pyrope Testnet",
  shortName: "pyrope",
  chain: "ETH",
  icon: "pyrope",
  rpc: [
    "https://rpc.pyropechain.com",
    "wss://rpc.pyropechain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://pyropechain.com",
  chainId: 695569,
  networkId: 695569,
  explorers: [
    {
      name: "blockscout",
      url: "https://pyrope.blockscout.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://pyropechain.com/bridge",
      },
    ],
  },
} satisfies Chain
