import type { Chain } from "../shared"

export const eip155_16602 = {
  name: "0G Galileo Testnet",
  shortName: "0g-galileo-testnet",
  chain: "0G",
  icon: "0g",
  rpc: ["https://evmrpc-testnet.0g.ai"],
  faucets: [
    "https://faucet.0g.ai",
    "https://cloud.google.com/application/web3/faucet/0g/galileo",
  ],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "0G",
    symbol: "0G",
    decimals: 18,
  },
  infoURL: "https://0g.ai",
  chainId: 16602,
  networkId: 16602,
  slip44: 1,
  explorers: [
    {
      name: "0G Chainscan",
      url: "https://chainscan-galileo.0g.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
