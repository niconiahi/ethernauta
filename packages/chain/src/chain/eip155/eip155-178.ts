import type { Chain } from "../shared"

export const eip155_178 = {
  name: "Abey Testnet",
  shortName: "abeyt",
  chain: "Abey",
  icon: "abey",
  rpc: ["https://testrpc.abeychain.com"],
  faucets: ["https://testnet-faucet.abeychain.com"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "ABEY",
    symbol: "tABEY",
    decimals: 18,
  },
  infoURL: "https://abey.com",
  chainId: 178,
  networkId: 178,
  explorers: [
    {
      name: "abeyscan-testnet",
      url: "https://testnet.abeyscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
