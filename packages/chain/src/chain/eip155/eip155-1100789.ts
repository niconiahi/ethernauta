// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1100789 = {
  name: "Netmind Chain Testnet",
  shortName: "nmtTest",
  title: "NetMind Chain Testnet",
  chain: "NetMind",
  icon: "netmind",
  rpc: ["https://testblock.protago-dev.com"],
  faucets: [],
  nativeCurrency: {
    name: "NMT",
    symbol: "NMT",
    decimals: 18,
  },
  infoURL: "https://netmind.ai",
  chainId: 1100789,
  networkId: 1100789,
  explorers: [
    {
      name: "NetMind Testnet Explorer",
      url: "https://testbrower.protago-dev.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
