// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_123321 = {
  name: "Gemchain",
  shortName: "gemchain",
  chain: "Gemchain",
  rpc: ["https://evm-rpc.gemchain.org"],
  faucets: [],
  nativeCurrency: {
    name: "GEM",
    symbol: "GEM",
    decimals: 18,
  },
  infoURL: "https://gemchain.org",
  chainId: 123321,
  networkId: 123321,
  slip44: 1,
  explorers: [
    {
      name: "Gemchain Scan",
      url: "https://scan.gemchain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
