import type { Chain } from "../shared"

export const eip155_6343 = {
  name: "MegaETH Testnet",
  shortName: "megaeth-testnet",
  chain: "MegaETH",
  icon: "megaeth",
  rpc: ["https://carrot.megaeth.com/rpc"],
  faucets: ["https://testnet.megaeth.com"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://megaeth.com",
  chainId: 6343,
  networkId: 6343,
  explorers: [
    {
      name: "MegaETH Testnet Explorer",
      url: "https://testnet-mega.etherscan.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
  status: "active",
} satisfies Chain
