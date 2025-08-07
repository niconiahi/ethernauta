// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9091 = {
  name: "KPA Smart Chain Testnet",
  shortName: "KPA",
  chain: "KSC",
  icon: "koppa",
  rpc: [
    "https://tkpa-rpc1.kpachain.com/",
    "https://tkpa-rpc2.kpachain.com/",
    "https://tkpa-rpc3.kpachain.com/",
    "https://tkpa-rpc4.kpachain.com/",
    "https://testnet-rpc1.kpascan.com/",
    "https://testnet-rpc2.kpascan.com/",
    "https://testnet-rpc3.kpascan.com/",
    "https://testnet-rpc4.kpascan.com/",
  ],
  faucets: ["https://mint.kpachain.com"],
  features: [],
  nativeCurrency: {
    name: "KPA Smart Chain Testnet",
    symbol: "tKPA",
    decimals: 18,
  },
  infoURL: "https://kpachain.com",
  chainId: 9091,
  networkId: 9091,
  explorers: [],
} satisfies Chain
