// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_157 = {
  name: "Puppynet",
  shortName: "puppynet",
  chain: "Puppynet",
  icon: "shibarium",
  rpc: ["https://puppynet.shibrpc.com"],
  faucets: ["https://shibarium.shib.io/faucet"],
  nativeCurrency: {
    name: "BONE",
    symbol: "BONE",
    decimals: 18,
  },
  infoURL: "https://shibariumecosystem.com",
  chainId: 157,
  networkId: 157,
  explorers: [
    {
      name: "puppyscan",
      url: "https://puppyscan.shib.io",
      standard: "none",
    },
  ],
} satisfies Chain
