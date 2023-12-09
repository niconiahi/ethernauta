/* eslint no-template-curly-in-string: 0 */
export const filecoinCalibration = {
  name: "Filecoin - Calibration testnet",
  shortName: "filecoin-calibration",
  chain: "FIL",
  icon: "filecoin",
  rpc: [
    "https://api.calibration.node.glif.io/rpc/v1",
    "https://rpc.ankr.com/filecoin_testnet",
    "https://filecoin-calibration.chainstacklabs.com/rpc/v1",
    "https://filecoin-calibration.chainup.net/rpc/v1",
    "https://calibration.filfox.info/rpc/v1",
  ],
  faucets: [
    "https://faucet.calibration.fildev.network/",
  ],
  nativeCurrency: {
    name: "testnet filecoin",
    symbol: "tFIL",
    decimals: 18,
  },
  infoURL: "https://filecoin.io",
  chainId: 314159,
  networkId: 314159,
  slip44: 1,
  explorers: [
    {
      name: "Filscan - Calibration",
      url: "https://calibration.filscan.io",
      standard: "none",
    },
    {
      name: "Filscout - Calibration",
      url: "https://calibration.filscout.com/en",
      standard: "none",
    },
    {
      name: "Filfox - Calibration",
      url: "https://calibration.filfox.info",
      standard: "none",
    },
    {
      name: "Glif Explorer - Calibration",
      url: "https://explorer.glif.io/?network=calibration",
      standard: "none",
    },
    {
      name: "Beryx",
      url: "https://beryx.zondax.ch",
      standard: "none",
    },
  ],
} as const