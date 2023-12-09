/* eslint no-template-curly-in-string: 0 */
export const bmct = {
  name: "BMC Testnet",
  shortName: "BMCT",
  chain: "BMC",
  rpc: [
    "https://testnet.bmcchain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTM",
    symbol: "BTM",
    decimals: 18,
  },
  infoURL: "https://bmc.bytom.io/",
  chainId: 189,
  networkId: 189,
  explorers: [
    {
      name: "Blockmeta",
      url: "https://bmctestnet.blockmeta.com",
      standard: "none",
    },
  ],
} as const
