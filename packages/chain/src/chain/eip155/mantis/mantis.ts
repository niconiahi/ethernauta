/* eslint no-template-curly-in-string: 0 */
export const mantis = {
  name: "Mantis Testnet (Hexapod)",
  shortName: "mantis",
  chain: "Mantis",
  icon: "mantis",
  rpc: [
    "https://mantis-rpc.switch.ch",
    "https://mantis-rpc.kore-technologies.ch",
    "https://mantis-rpc.phoenix-systems.io",
  ],
  faucets: [
    "https://mantis.switch.ch/faucet",
    "https://mantis.kore-technologies.ch/faucet",
    "https://mantis.phoenix-systems.io/faucet",
    "https://mantis.block-spirit.ch/faucet",
  ],
  nativeCurrency: {
    name: "Mantis",
    symbol: "MANTIS",
    decimals: 18,
  },
  infoURL: "https://hexapod.network",
  chainId: 96970,
  networkId: 96970,
  explorers: [
    {
      name: "Mantis Blockscout",
      url: "https://blockscout.mantis.hexapod.network",
      standard: "EIP3091",
    },
  ],
} as const
