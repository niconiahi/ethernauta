import type { Chain } from "../shared"

export const eip155_11142220 = {
  name: "Celo Sepolia Testnet",
  shortName: "celo-sep",
  chain: "CELO",
  rpc: ["https://forno.celo-sepolia.celo-testnet.org"],
  faucets: ["https://faucet.celo.org"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  infoURL: "https://docs.celo.org",
  chainId: 11142220,
  networkId: 11142220,
  slip44: 60,
  explorers: [
    {
      name: "Celo Sepolia Explorer",
      url: "https://celo-sepolia.blockscout.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://superbridge.app/?fromChainId=11155111&toChainId=11142220",
      },
    ],
  },
} satisfies Chain
