/* eslint no-template-curly-in-string: 0 */
export const frametest = {
  name: "Frame Testnet",
  shortName: "frametest",
  chain: "ETH",
  icon: "frameTestnet",
  rpc: [
    "https://rpc.testnet.frame.xyz/http",
  ],
  faucets: [
    "https://faucet.triangleplatform.com/frame/testnet",
  ],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.frame.xyz/",
  chainId: 68840142,
  networkId: 68840142,
  explorers: [
    {
      name: "Frame Testnet Explorer",
      url: "https://explorer.testnet.frame.xyz",
      standard: "EIP3091",
    },
  ],
} as const