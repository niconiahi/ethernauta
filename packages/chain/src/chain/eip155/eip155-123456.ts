// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_123456 = {
  name: "ADIL Devnet",
  shortName: "dadil",
  chain: "ADIL",
  icon: "adil",
  rpc: ["https://devnet.adilchain-rpc.io"],
  faucets: [],
  nativeCurrency: {
    name: "Devnet ADIL",
    symbol: "ADIL",
    decimals: 18,
  },
  infoURL: "https://adilchain.io",
  chainId: 123456,
  networkId: 123456,
  explorers: [
    {
      name: "ADIL Devnet Explorer",
      url: "https://devnet.adilchain-scan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
