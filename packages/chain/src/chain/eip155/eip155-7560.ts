// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7560 = {
  name: "Cyber Mainnet",
  shortName: "cyeth",
  chain: "Cyber",
  icon: "cyber",
  rpc: [
    "https://cyber.alt.technology/",
    "wss://cyber-ws.alt.technology/",
    "https://rpc.cyber.co/",
    "wss://rpc.cyber.co/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://cyber.co/",
  chainId: 7560,
  networkId: 7560,
  explorers: [
    {
      name: "Cyber Mainnet Explorer",
      url: "https://cyberscan.co",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://cyber.co/bridge",
      },
    ],
  },
} satisfies Chain
