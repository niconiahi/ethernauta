/* eslint no-template-curly-in-string: 0 */
export const zkevm = {
  name: "Polygon zkEVM",
  shortName: "zkevm",
  title: "Polygon zkEVM",
  chain: "Polygon",
  icon: "zkevm",
  rpc: [
    "https://zkevm-rpc.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://polygon.technology/polygon-zkevm",
  chainId: 1101,
  networkId: 1101,
  explorers: [
    {
      name: "blockscout",
      url: "https://zkevm.polygonscan.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.zkevm-rpc.com",
      },
    ],
  },
} as const
