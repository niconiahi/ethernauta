// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1570 = {
  name: "StarCHAIN Testnet",
  shortName: "starchain-testnet",
  chain: "StarCHAIN",
  rpc: ["https://testnet-rpc1.starworksglobal.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "STARX",
    symbol: "STARX",
    decimals: 18,
  },
  infoURL: "https://www.starworksglobal.com",
  chainId: 1570,
  networkId: 1570,
  explorers: [
    {
      name: "StarCHAIN Explorer",
      url: "https://testnet.starchainscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
