/* eslint no-template-curly-in-string: 0 */
export const hpn = {
  name: "HyperonChain TestNet",
  shortName: "hpn",
  chain: "HPN",
  icon: "hyperonchain",
  rpc: [
    "https://testnet-rpc.hyperonchain.com",
  ],
  faucets: [
    "https://faucet.hyperonchain.com",
  ],
  nativeCurrency: {
    name: "HyperonChain",
    symbol: "HPN",
    decimals: 18,
  },
  infoURL: "https://docs.hyperonchain.com",
  chainId: 400,
  networkId: 400,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet.hyperonchain.com",
      standard: "EIP3091",
    },
  ],
} as const
