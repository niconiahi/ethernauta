import type { Chain } from "../shared"

export const eip155_76672 = {
  name: "CarrChain Testnet",
  shortName: "CarrChain-Testnet",
  chain: "CarrChain Testnet",
  icon: "carrchain",
  rpc: ["https://rpc-testnet.carrchain.io"],
  faucets: ["https://faucet.carrchain.io"],
  nativeCurrency: {
    name: "CarrChain Coin",
    symbol: "CARR",
    decimals: 18,
  },
  infoURL: "https://carrchain.io",
  chainId: 76672,
  networkId: 76672,
  explorers: [
    {
      name: "tracehawk",
      url: "https://testnet.carrscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
