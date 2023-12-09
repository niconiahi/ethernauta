/* eslint no-template-curly-in-string: 0 */
export const twemix = {
  name: "WEMIX3.0 Testnet",
  shortName: "twemix",
  chain: "TWEMIX",
  rpc: [
    "https://api.test.wemix.com",
    "wss://ws.test.wemix.com",
  ],
  faucets: [
    "https://wallet.test.wemix.com/faucet",
  ],
  nativeCurrency: {
    name: "TestnetWEMIX",
    symbol: "tWEMIX",
    decimals: 18,
  },
  infoURL: "https://wemix.com",
  chainId: 1112,
  networkId: 1112,
  explorers: [
    {
      name: "WEMIX Testnet Microscope",
      url: "https://microscope.test.wemix.com",
      standard: "EIP3091",
    },
  ],
} as const