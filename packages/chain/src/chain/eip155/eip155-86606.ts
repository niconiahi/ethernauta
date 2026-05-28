import type { Chain } from "../shared"

export const eip155_86606 = {
  name: "CpChain Testnet",
  shortName: "cpchain-testnet",
  chain: "CpChain",
  icon: "cpchain",
  rpc: ["https://rpc-testnet.cpchain.com"],
  faucets: ["https://cpchain-test.pages.dev/faucet"],
  nativeCurrency: {
    name: "CP",
    symbol: "CP",
    decimals: 18,
  },
  infoURL: "https://cpchain.com",
  chainId: 86606,
  networkId: 86606,
  slip44: 1,
  explorers: [
    {
      name: "CpChain Testnet Explorer",
      url: "https://explorer-testnet.cpchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
