/* eslint no-template-curly-in-string: 0 */
export const meterTest = {
  name: "Meter Testnet",
  shortName: "MeterTest",
  chain: "METER Testnet",
  rpc: [
    "https://rpctest.meter.io",
  ],
  faucets: [
    "https://faucet-warringstakes.meter.io",
  ],
  nativeCurrency: {
    name: "Meter",
    symbol: "MTR",
    decimals: 18,
  },
  infoURL: "https://www.meter.io",
  chainId: 83,
  networkId: 83,
  explorers: [
    {
      name: "Meter Testnet Scan",
      url: "https://scan-warringstakes.meter.io",
      standard: "EIP3091",
    },
  ],
} as const
