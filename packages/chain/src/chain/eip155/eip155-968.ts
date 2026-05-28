import type { Chain } from "../shared"

export const eip155_968 = {
  name: "Datagram",
  shortName: "dgram",
  chain: "DGRAM",
  icon: "dgram",
  rpc: ["https://mainnet.datagram.network/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "DGRAM",
    symbol: "DGRAM",
    decimals: 18,
  },
  infoURL:
    "https://doc.datagram.network/introduction/what-is-datagram",
  chainId: 968,
  networkId: 968,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.datagram.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
