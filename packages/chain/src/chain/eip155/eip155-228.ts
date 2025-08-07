// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_228 = {
  name: "Mind Network Mainnet",
  shortName: "fhe",
  chain: "FHE",
  rpc: [
    "https://rpc-mainnet.mindnetwork.xyz",
    "wss://rpc-mainnet.mindnetwork.xyz",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://mindnetwork.xyz",
  chainId: 228,
  networkId: 228,
} satisfies Chain
