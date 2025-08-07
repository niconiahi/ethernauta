// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_72778 = {
  name: "CAGA crypto Ankara testnet",
  shortName: "caga",
  chain: "Ankara",
  icon: "ankaracaga",
  rpc: [
    "https://www.ankara-cagacrypto.com",
    "wss://wss.ankara-cagacrypto.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Caga",
    symbol: "CAGA",
    decimals: 18,
  },
  infoURL: "https://www.cagacrypto.com/",
  chainId: 72778,
  networkId: 72778,
  explorers: [
    {
      name: "ankara",
      url: "https://explorer.ankara-cagacrypto.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
