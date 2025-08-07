// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1009 = {
  name: "Jumbochain Mainnet",
  shortName: "Jumboscan",
  chain: "Jumbo",
  rpc: [
    "https://rpcpriv.jumbochain.org",
    "https://rpc-datajumbo1.jumbochain.org",
    "https://rpc-datajumbo2.jumbochain.org",
    "https://rpc-datajumbo3.jumbochain.org",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "JNFTC",
    symbol: "JNFTC",
    decimals: 18,
  },
  infoURL: "https://jumbochain.org",
  chainId: 1009,
  networkId: 1009,
  slip44: 1,
  explorers: [
    {
      name: "Jumboscan",
      url: "https://jumboscan.jumbochain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
