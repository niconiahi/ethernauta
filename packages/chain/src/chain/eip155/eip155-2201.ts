import type { Chain } from "../shared"

export const eip155_2201 = {
  name: "Stable Testnet",
  shortName: "stable-testnet",
  chain: "Stable",
  icon: "stable",
  rpc: ["https://rpc.testnet.stable.xyz"],
  faucets: ["https://faucet.stable.xyz"],
  nativeCurrency: {
    name: "USDT0",
    symbol: "USDT0",
    decimals: 18,
  },
  infoURL: "https://stable.xyz",
  chainId: 2201,
  networkId: 2201,
  explorers: [
    {
      name: "Stablescan",
      url: "https://testnet.stablescan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
