import type { Chain } from "../shared"

export const eip155_626 = {
  name: "BattleChain Mainnet",
  shortName: "battlechain",
  chain: "ETH",
  icon: "battlechain",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://battlechain.com",
  chainId: 626,
  networkId: 626,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.battlechain.com/bridge",
      },
    ],
  },
  status: "incubating",
} satisfies Chain
