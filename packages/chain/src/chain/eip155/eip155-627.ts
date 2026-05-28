import type { Chain } from "../shared"

export const eip155_627 = {
  name: "BattleChain Testnet",
  shortName: "battlechain-testnet",
  chain: "ETH",
  icon: "battlechain",
  rpc: ["https://testnet.battlechain.com"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://battlechain.com",
  chainId: 627,
  networkId: 627,
  slip44: 1,
  explorers: [
    {
      name: "BattleChain Explorer",
      url: "https://explorer.testnet.battlechain.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://portal.battlechain.com/bridge",
      },
    ],
  },
} satisfies Chain
