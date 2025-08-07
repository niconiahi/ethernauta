// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_110 = {
  name: "Proton Testnet",
  shortName: "xpr",
  chain: "XPR",
  rpc: ["https://protontestnet.greymass.com/"],
  faucets: [],
  nativeCurrency: {
    name: "Proton",
    symbol: "XPR",
    decimals: 4,
  },
  infoURL: "https://protonchain.com",
  chainId: 110,
  networkId: 110,
  slip44: 1,
} satisfies Chain
