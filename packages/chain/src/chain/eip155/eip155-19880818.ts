// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19880818 = {
  name: "DeepBrainChain Mainnet",
  shortName: "DBC",
  chain: "DeepBrainChain",
  icon: "dbc",
  rpc: ["https://rpc.dbcwallet.io"],
  faucets: [],
  nativeCurrency: {
    name: "DeepBrainChain",
    symbol: "DBC",
    decimals: 18,
  },
  infoURL: "https://www.deepbrainchain.org",
  chainId: 19880818,
  networkId: 19880818,
  slip44: 1,
  explorers: [
    {
      name: "DeepBrainChain Mainnet",
      url: "https://www.dbcscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
