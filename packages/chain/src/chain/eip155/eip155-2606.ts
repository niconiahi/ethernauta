import type { Chain } from "../shared"

export const eip155_2606 = {
  name: "PoCRNet",
  shortName: "pocrnet",
  title: "Proof of Climate awaReness mainnet",
  chain: "CRC",
  icon: "pocr",
  rpc: [
    "https://rpc1.pocrnet.ca-dag.work",
    "https://rpc2.pocrnet.ca-dag.work",
    "wss://rpc1.pocrnet.ca-dag.work/ws",
    "wss://rpc2.pocrnet.ca-dag.work/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Climate awaReness Coin",
    symbol: "CRC",
    decimals: 18,
  },
  infoURL: "https://github.com/ethereum-pocr/pocrnet",
  chainId: 2606,
  networkId: 2606,
  explorers: [
    {
      name: "Lite Explorer",
      url: "https://ethereum-pocr.github.io/explorer/pocrnet",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
