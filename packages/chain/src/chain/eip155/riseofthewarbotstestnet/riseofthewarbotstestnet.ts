/* eslint no-template-curly-in-string: 0 */
export const riseOfTheWarbotsTestnet = {
  name: "Rise of the Warbots Testnet",
  shortName: "RiseOfTheWarbotsTestnet",
  chain: "nmactest",
  rpc: [
    "https://testnet1.riseofthewarbots.com",
    "https://testnet2.riseofthewarbots.com",
    "https://testnet3.riseofthewarbots.com",
    "https://testnet4.riseofthewarbots.com",
    "https://testnet5.riseofthewarbots.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Nano Machines",
    symbol: "NMAC",
    decimals: 18,
  },
  infoURL: "https://riseofthewarbots.com/",
  chainId: 7777,
  networkId: 7777,
  explorers: [
    {
      name: "avascan",
      url: "https://testnet.avascan.info/blockchain/2mZ9doojfwHzXN3VXDQELKnKyZYxv7833U8Yq5eTfFx3hxJtiy",
      standard: "none",
    },
  ],
} as const
