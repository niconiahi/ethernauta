import type { Chain } from "../shared"

export const eip155_5318007 = {
  name: "Reactive Lasna",
  shortName: "lreact",
  title: "Reactive Network Testnet Lasna",
  chain: "REACT",
  icon: "reactive",
  rpc: ["https://lasna-rpc.rnk.dev"],
  faucets: [
    "https://dev.reactive.network/reactive-mainnet#get-testnet-react",
  ],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Lasna React",
    symbol: "lREACT",
    decimals: 18,
  },
  infoURL: "https://reactive.network",
  chainId: 5318007,
  networkId: 5318007,
  explorers: [
    {
      name: "Reactscan",
      url: "https://lasna.reactscan.net",
      standard: "none",
    },
  ],
} satisfies Chain
