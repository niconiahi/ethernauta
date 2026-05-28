import type { Chain } from "../shared"

export const eip155_65349 = {
  name: "CratD2C Testnet Deprecated",
  shortName: "cratd2c-testnet-deprecated",
  chain: "CRATD2C",
  icon: "cratd2c-testnet",
  rpc: [
    "https://cratd2c-testnet-node1.cratd2csmartchain.io/",
    "https://cratd2c-testnet-node2.cratd2csmartchain.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CRATD2C",
    symbol: "CRAT",
    decimals: 18,
  },
  infoURL: "https://cratd2csmartchain.io",
  chainId: 65349,
  networkId: 65349,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer-testnet.cratd2csmartchain.io",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} satisfies Chain
