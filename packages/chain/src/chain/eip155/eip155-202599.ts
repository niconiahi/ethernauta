import type { Chain } from "../shared"

export const eip155_202599 = {
  name: "JuChain Testnet",
  shortName: "ju-test",
  chain: "JuChain",
  icon: "ju-test",
  rpc: [
    "https://testnet-rpc.juchain.org",
    "wss://testnet-ws.juchain.org",
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
    name: "JU Testnet Token",
    symbol: "JU",
    decimals: 18,
  },
  infoURL: "https://www.juchain.org",
  chainId: 202599,
  networkId: 202599,
  explorers: [
    {
      name: "JUChain Test Explorer",
      url: "https://testnet.juscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
