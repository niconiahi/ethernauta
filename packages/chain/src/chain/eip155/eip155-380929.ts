import type { Chain } from "../shared"

export const eip155_380929 = {
  name: "Silent Data Mainnet",
  shortName: "silent-data-mainnet",
  chain: "Silent Data",
  icon: "silentdata",
  rpc: [
    "https://mainnet.silentdata.com/${SILENTDATA_AUTH_TOKEN}",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.silentdata.com",
  chainId: 380929,
  networkId: 380929,
  explorers: [
    {
      name: "Silent Data Mainnet Explorer",
      url: "https://explorer-mainnet.rollup.silentdata.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge-mainnet.rollup.silentdata.com",
      },
    ],
  },
} satisfies Chain
