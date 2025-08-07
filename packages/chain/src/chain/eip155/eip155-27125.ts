// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_27125 = {
  name: "XferChain Testnet",
  shortName: "DPt",
  chain: "XferChain Testnet",
  icon: "xferIcon",
  rpc: ["https://testnet-rpc.xferchain.org"],
  faucets: ["https://faucet.xferchain.org"],
  nativeCurrency: {
    name: "Dapo",
    symbol: "Dapo",
    decimals: 18,
  },
  infoURL: "https://xferchain.org",
  chainId: 27125,
  networkId: 27125,
  explorers: [
    {
      name: "XferChain Testnet Explorer",
      url: "https://testnet.xferchain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
