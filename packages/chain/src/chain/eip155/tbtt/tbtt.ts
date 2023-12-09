/* eslint no-template-curly-in-string: 0 */
export const tbtt = {
  name: "BitTorrent Chain Testnet",
  shortName: "tbtt",
  chain: "BTTC",
  rpc: [
    "https://testrpc.bittorrentchain.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BitTorrent",
    symbol: "BTT",
    decimals: 18,
  },
  infoURL: "https://bittorrentchain.io/",
  chainId: 1028,
  networkId: 1028,
  explorers: [
    {
      name: "testbttcscan",
      url: "https://testscan.bittorrentchain.io",
      standard: "none",
    },
  ],
} as const