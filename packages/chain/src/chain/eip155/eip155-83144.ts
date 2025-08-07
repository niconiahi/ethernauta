// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_83144 = {
  name: "Xprotocol Testnet",
  shortName: "xprotocoltestnet",
  chain: "Xprotocol Testnet",
  rpc: ["https://rpc.testnet.xprotocol.org"],
  faucets: ["https://xprotocol.org/faucets"],
  nativeCurrency: {
    name: "KICK Testnet Token",
    symbol: "KICK",
    decimals: 18,
  },
  infoURL: "https://xprotocol.org/",
  chainId: 83144,
  networkId: 83144,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.testnet.xprotocol.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-84532",
  },
} satisfies Chain
