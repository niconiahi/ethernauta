// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_484752 = {
  name: "World Chain Sepolia Testnet Deprecated",
  shortName: "wcsep-dep",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://worldcoin.org/",
  chainId: 484752,
  networkId: 484752,
  slip44: 1,
  status: "deprecated",
} satisfies Chain
