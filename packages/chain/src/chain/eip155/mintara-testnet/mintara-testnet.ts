/* eslint no-template-curly-in-string: 0 */
export const mintaraTestnet = {
  name: "Mintara Testnet",
  shortName: "mintara-testnet",
  title: "Mintara Testnet",
  chain: "Mintara",
  icon: "mintara",
  rpc: [
    "https://subnets.avax.network/mintara/testnet/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MINTARA",
    symbol: "MNTR",
    decimals: 18,
  },
  infoURL: "https://playthink.co.jp",
  chainId: 1079,
  networkId: 1079,
  explorers: [
    {
      name: "explorer",
      url: "https://subnets-test.avax.network/mintara",
      standard: "EIP3091",
    },
  ],
} as const
