import type { Chain } from "../shared"

export const eip155_737373 = {
  name: "bokuto",
  shortName: "bokuto",
  chain: "bokuto",
  icon: "katana",
  rpc: ["https://rpc-bokuto.katanarpc.com"],
  faucets: ["https://faucet.katana.tools"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://katana.network",
  chainId: 737373,
  networkId: 737373,
  explorers: [
    {
      name: "bokutoscan",
      url: "https://bokuto.katanascan.com",
      standard: "EIP3091",
    },
    {
      name: "bokuto explorer",
      url: "https://explorer-bokuto.katanarpc.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
