import type { Chain } from "../shared"

export const eip155_680 = {
  name: "JasmyChain",
  shortName: "jasmychain",
  chain: "jasmychain",
  icon: "jasmychain",
  rpc: [
    "https://rpc.jasmyscan.net",
    "wss://rpc.jasmyscan.net/ws",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "JasmyCoin",
    symbol: "JASMY",
    decimals: 18,
  },
  infoURL: "https://jasmy.global",
  chainId: 680,
  networkId: 680,
  explorers: [
    {
      name: "jasmyscan",
      url: "https://explorer.jasmyscan.net",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.arbitrum.io/bridge?sourceChain=ethereum&destinationChain=jasmychain",
      },
    ],
  },
} satisfies Chain
