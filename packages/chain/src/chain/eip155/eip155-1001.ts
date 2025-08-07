// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1001 = {
  name: "Kaia Kairos Testnet",
  shortName: "kaia-kairos",
  chain: "KAIA",
  rpc: ["https://public-en-kairos.node.kaia.io"],
  faucets: ["https://faucet.kaia.io"],
  nativeCurrency: {
    name: "KAIA",
    symbol: "KAIA",
    decimals: 18,
  },
  infoURL: "https://kaia.io/",
  chainId: 1001,
  networkId: 1001,
  slip44: 1,
  explorers: [
    {
      name: "Kaiascope",
      url: "https://kairos.kaiascope.com",
      standard: "EIP3091",
    },
    {
      name: "Kaiascan",
      url: "https://kairos.kaiascan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
