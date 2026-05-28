import type { Chain } from "../shared"

export const eip155_10791 = {
  name: "TrustBitcoin Mainnet",
  shortName: "trustbtc",
  chain: "TBC",
  icon: "trustbitcoin",
  rpc: ["https://rpc.trustbitcoin.io"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "TrustBitcoin",
    symbol: "TBC",
    decimals: 18,
  },
  infoURL: "https://trustbitcoin.io",
  chainId: 10791,
  networkId: 10791,
  explorers: [
    {
      name: "TrustBitcoin Scan",
      url: "https://scan.trustbitcoin.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
