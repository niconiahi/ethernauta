import type { Chain } from "../shared"

export const eip155_5124 = {
  name: "Seismic Testnet",
  shortName: "seismic-testnet",
  chain: "Seismic",
  rpc: [
    "https://gcp-1.seismictest.net/rpc",
    "https://gcp-2.seismictest.net/rpc",
    "wss://gcp-1.seismictest.net/ws",
    "wss://gcp-2.seismictest.net/ws",
  ],
  faucets: ["https://faucet.seismictest.net"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Seismic Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://seismic.systems",
  chainId: 5124,
  networkId: 5124,
  explorers: [
    {
      name: "Seismic Testnet Explorer",
      url: "https://seismic-testnet.socialscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
