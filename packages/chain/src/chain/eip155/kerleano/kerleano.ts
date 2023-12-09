/* eslint no-template-curly-in-string: 0 */
export const kerleano = {
  name: "Kerleano",
  shortName: "kerleano",
  title: "Proof of Climate awaReness testnet",
  chain: "CRC",
  icon: "pocr",
  rpc: [
    "https://cacib-saturn-test.francecentral.cloudapp.azure.com",
    "wss://cacib-saturn-test.francecentral.cloudapp.azure.com:9443",
  ],
  faucets: [
    "https://github.com/ethereum-pocr/kerleano/blob/main/docs/faucet.md",
  ],
  nativeCurrency: {
    name: "Climate awaReness Coin",
    symbol: "CRC",
    decimals: 18,
  },
  infoURL: "https://github.com/ethereum-pocr/kerleano",
  chainId: 1804,
  networkId: 1804,
  explorers: [
    {
      name: "Lite Explorer",
      url: "https://ethereum-pocr.github.io/explorer/kerleano",
      standard: "EIP3091",
    },
  ],
  status: "active",
} as const
