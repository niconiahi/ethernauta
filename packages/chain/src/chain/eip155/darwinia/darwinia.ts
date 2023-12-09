/* eslint no-template-curly-in-string: 0 */
export const darwinia = {
  name: "Darwinia Network",
  shortName: "darwinia",
  chain: "darwinia",
  rpc: [
    "https://rpc.darwinia.network",
    "https://darwinia-rpc.darwiniacommunitydao.xyz",
    "https://darwinia-rpc.dwellir.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Darwinia Network Native Token",
    symbol: "RING",
    decimals: 18,
  },
  infoURL: "https://darwinia.network/",
  chainId: 46,
  networkId: 46,
  explorers: [
    {
      name: "subscan",
      url: "https://darwinia.subscan.io",
      standard: "none",
    },
  ],
} as const
