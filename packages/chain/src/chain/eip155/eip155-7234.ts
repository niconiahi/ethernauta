// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7234 = {
  name: "InitVerse genesis testnet",
  shortName: "INICHAIN",
  chain: "InitVerse",
  icon: "initverse",
  rpc: ["http://rpc-testnet.inichain.com"],
  faucets: [],
  nativeCurrency: {
    name: "InitVerse",
    symbol: "INI",
    decimals: 18,
  },
  infoURL: "https://genesis-testnet.inichain.com",
  chainId: 7234,
  networkId: 7234,
  explorers: [
    {
      name: "initverse",
      url: "https://genesis-testnet.iniscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
