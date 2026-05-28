import type { Chain } from "../shared"

export const eip155_1148 = {
  name: "POC Testnet",
  shortName: "poc",
  chain: "POC",
  icon: "pochain",
  rpc: ["https://testnet-rpc.pochain.io"],
  faucets: ["https://www.pochain.io/poc-faucet"],
  nativeCurrency: {
    name: "POC Native Token",
    symbol: "POC",
    decimals: 18,
  },
  infoURL: "https://www.pochain.io",
  chainId: 1148,
  networkId: 1148,
  explorers: [
    {
      name: "pocscan",
      url: "https://testnet.pocscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
