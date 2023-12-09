/* eslint no-template-curly-in-string: 0 */
export const eip155_1261120 = {
  name: "zKatana",
  shortName: "azktn",
  title: "Astar zkEVM Testnet zKatana",
  chain: "ETH",
  icon: "astarzk",
  rpc: [
    "https://rpc.zkatana.gelato.digital",
    "https://rpc.startale.com/zkatana",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://astar.network",
  chainId: 1261120,
  networkId: 1261120,
  explorers: [
    {
      name: "Blockscout zKatana chain explorer",
      url: "https://zkatana.blockscout.com",
      standard: "EIP3091",
    },
    {
      name: "Startale zKatana chain explorer",
      url: "https://zkatana.explorer.startale.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://portal.astar.network",
      },
      {
        url: "https://bridge.zkatana.gelato.digital",
      },
    ],
  },
  status: "active",
} as const
