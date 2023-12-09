/* eslint no-template-curly-in-string: 0 */
export const testnetZkEvmMango = {
  name: "Polygon zkEVM Testnet",
  shortName: "testnet-zkEVM-mango",
  title: "Polygon zkEVM Testnet",
  chain: "Polygon",
  rpc: [
    "https://rpc.public.zkevm-test.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://polygon.technology/solutions/polygon-zkevm/",
  chainId: 1442,
  networkId: 1442,
  explorers: [
    {
      name: "Polygon zkEVM explorer",
      url: "https://explorer.public.zkevm-test.net",
      standard: "EIP3091",
    },
  ],
} as const
