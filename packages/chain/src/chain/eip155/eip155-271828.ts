import type { Chain } from "../shared"

export const eip155_271828 = {
  name: "Datachain Rope",
  shortName: "datachain",
  chain: "DATACHAIN",
  icon: "datachain",
  rpc: [
    "https://erpc.datachain.network",
    "wss://ws.datachain.network",
    "https://erpc.rope.network",
    "wss://ws.rope.network",
  ],
  faucets: ["https://faucet.datachain.network"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "DC FAT",
    symbol: "FAT",
    decimals: 18,
  },
  infoURL: "https://datachain.network",
  chainId: 271828,
  networkId: 271828,
  explorers: [
    {
      name: "DC Scan",
      url: "https://dcscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
