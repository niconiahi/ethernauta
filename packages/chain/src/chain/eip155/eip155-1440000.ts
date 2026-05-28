import type { Chain } from "../shared"

export const eip155_1440000 = {
  name: "XRPL EVM Sidechain",
  shortName: "xrplevm",
  chain: "XRPL EVM",
  icon: "xrplevm",
  rpc: ["https://rpc.xrplevm.org", "wss://ws.xrplevm.org"],
  faucets: ["https://faucet.xrplevm.org"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "XRP",
    symbol: "XRP",
    decimals: 18,
  },
  infoURL: "https://xrplevm.org",
  chainId: 1440000,
  networkId: 1440000,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.xrplevm.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
