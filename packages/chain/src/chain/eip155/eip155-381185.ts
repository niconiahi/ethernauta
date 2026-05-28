import type { Chain } from "../shared"

export const eip155_381185 = {
  name: "Silent Data Testnet",
  shortName: "silent-data-testnet",
  chain: "Silent Data",
  icon: "silentdata-testnet",
  rpc: [
    "https://testnet.silentdata.com/${SILENTDATA_AUTH_TOKEN}",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.silentdata.com",
  chainId: 381185,
  networkId: 381185,
  explorers: [
    {
      name: "Silent Data Testnet Explorer",
      url: "https://explorer-testnet.rollup.silentdata.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge-testnet.rollup.silentdata.com",
      },
    ],
  },
} satisfies Chain
