/* eslint no-template-curly-in-string: 0 */
export const tMind = {
  name: "Mind Smart Chain Testnet",
  shortName: "tMIND",
  chain: "tMIND",
  icon: "mindchain",
  rpc: [
    "https://testnet-msc.mindchain.info/",
    "wss://testnet-msc.mindchain.info/ws",
  ],
  faucets: [
    "https://faucet.mindchain.info/",
  ],
  nativeCurrency: {
    name: "MIND Coin",
    symbol: "tMIND",
    decimals: 18,
  },
  infoURL: "https://mindchain.info",
  chainId: 9977,
  networkId: 9977,
  explorers: [
    {
      name: "Mind Chain explorer",
      url: "https://testnet.mindscan.info",
      standard: "EIP3091",
    },
  ],
} as const
