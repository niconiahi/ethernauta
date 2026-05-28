import type { Chain } from "../shared"

export const eip155_82716 = {
  name: "Pylun Testnet",
  shortName: "pylun",
  chain: "PYLUN",
  icon: "pylun",
  rpc: [
    "https://rpc.pylun.network",
    "wss://ws.pylun.network",
  ],
  faucets: ["https://faucet.pylun.network"],
  nativeCurrency: {
    name: "PYLUN",
    symbol: "PYLUN",
    decimals: 18,
  },
  infoURL: "https://pylun.network",
  chainId: 82716,
  networkId: 82716,
  slip44: 60,
  explorers: [
    {
      name: "PylunScan",
      url: "https://explorer.pylun.network",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
