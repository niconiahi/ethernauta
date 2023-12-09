/* eslint no-template-curly-in-string: 0 */
export const eip155_88002 = {
  name: "Nautilus Proteus Testnet",
  shortName: "NAUTTest",
  chain: "ETH",
  icon: "nautilus",
  rpc: [
    "https://api.proteus.nautchain.xyz/solana",
  ],
  faucets: [
    "https://proteusfaucet.nautchain.xyz",
  ],
  nativeCurrency: {
    name: "Zebec Test Token",
    symbol: "tZBC",
    decimals: 18,
  },
  infoURL: "https://docs.nautchain.xyz",
  chainId: 88002,
  networkId: 88002,
  explorers: [
    {
      name: "Nautscan",
      url: "https://proteus.nautscan.com",
      standard: "EIP3091",
    },
  ],
} as const
