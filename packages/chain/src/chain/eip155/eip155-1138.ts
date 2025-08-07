// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1138 = {
  name: "AmStar Testnet",
  shortName: "ASARt",
  chain: "AmStar",
  icon: "amstar",
  rpc: ["https://testnet-rpc.amstarscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "SINSO",
    symbol: "SINSO",
    decimals: 18,
  },
  infoURL: "https://sinso.io",
  chainId: 1138,
  networkId: 1138,
  slip44: 1,
  explorers: [
    {
      name: "amstarscan-testnet",
      url: "https://testnet.amstarscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
