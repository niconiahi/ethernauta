import type { Chain } from "../shared"

export const eip155_7667 = {
  name: "CarrChain Mainnet",
  shortName: "CarrChain-Mainnet",
  chain: "CarrChain Mainnet",
  icon: "carrchain",
  rpc: ["https://rpc.carrchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "CarrChain Coin",
    symbol: "CARR",
    decimals: 18,
  },
  infoURL: "https://carrchain.io",
  chainId: 7667,
  networkId: 7667,
  explorers: [
    {
      name: "tracehawk",
      url: "https://carrscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
