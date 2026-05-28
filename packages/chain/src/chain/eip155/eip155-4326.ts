import type { Chain } from "../shared"

export const eip155_4326 = {
  name: "MegaETH Mainnet",
  shortName: "megaeth",
  chain: "MegaETH",
  icon: "megaeth",
  rpc: [
    "https://mainnet.megaeth.com/rpc",
    "wss://mainnet.megaeth.com/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://megaeth.com",
  chainId: 4326,
  networkId: 4326,
  explorers: [
    {
      name: "MegaETH Etherscan",
      url: "https://mega.etherscan.io",
      standard: "EIP3091",
    },
    {
      name: "MegaETH Blockscout",
      url: "https://megaeth.blockscout.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://rabbithole.megaeth.com",
      },
    ],
  },
  status: "active",
} satisfies Chain
