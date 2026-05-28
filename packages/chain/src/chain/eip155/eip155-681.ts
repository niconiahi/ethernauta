import type { Chain } from "../shared"

export const eip155_681 = {
  name: "JasmyChain Testnet",
  shortName: "jasmychain-test",
  chain: "jasmychain-testnet",
  icon: "jasmychain",
  rpc: [
    "https://jasmy-chain-testnet.alt.technology",
    "wss://jasmy-chain-testnet.alt.technology/ws",
  ],
  faucets: ["https://faucet.janction.ai"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "JasmyCoin",
    symbol: "JASMY",
    decimals: 18,
  },
  infoURL: "https://jasmy.global",
  chainId: 681,
  networkId: 681,
  explorers: [
    {
      name: "jasmyscan",
      url: "https://jasmy-chain-testnet-explorer.alt.technology",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://portal.arbitrum.io/bridge?sourceChain=sepolia&destinationChain=jasmy-chain-testnet",
      },
    ],
  },
} satisfies Chain
