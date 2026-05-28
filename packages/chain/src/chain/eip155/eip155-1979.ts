import type { Chain } from "../shared"

export const eip155_1979 = {
  name: "CratD2C Testnet",
  shortName: "cratd2c-testnet",
  chain: "CRATD2C",
  icon: "cratd2c-testnet",
  rpc: [
    "https://rpc-testnet-1.cratd2csmartchain.io/",
    "https://rpc-testnet-2.cratd2csmartchain.io/",
    "https://rpc-testnet-3.cratd2csmartchain.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CRATD2C",
    symbol: "CRAT",
    decimals: 18,
  },
  infoURL: "https://cratd2csmartchain.io",
  chainId: 1979,
  networkId: 1979,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer-testnet.cratd2csmartchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
