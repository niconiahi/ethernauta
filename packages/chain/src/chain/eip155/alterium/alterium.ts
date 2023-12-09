/* eslint no-template-curly-in-string: 0 */
export const alterium = {
  name: "Alterium L2 Testnet",
  shortName: "alterium",
  chain: "ALT",
  icon: "alterium",
  rpc: [
    "https://l2-testnet-rpc.altscan.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Alterium ETH",
    symbol: "AltETH",
    decimals: 18,
  },
  infoURL: "https://alteriumprotocol.org",
  chainId: 420692,
  networkId: 420692,
  explorers: [
    {
      name: "Alterium L2 Testnet Explorer",
      url: "https://l2-testnet.altscan.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-5",
    bridges: [
      {
        url: "https://testnet-bridge.alteriumprotocol.org",
      },
    ],
  },
} as const
