import type { Chain } from "../shared"

export const eip155_7120 = {
  name: "Sentrix Testnet",
  shortName: "srx-testnet",
  chain: "Sentrix",
  icon: "sentrix",
  rpc: ["https://testnet-rpc.sentrixchain.com"],
  faucets: ["https://faucet.sentrixchain.com"],
  nativeCurrency: {
    name: "Sentrix",
    symbol: "SRX",
    decimals: 18,
  },
  infoURL: "https://sentrixchain.com",
  chainId: 7120,
  networkId: 7120,
  explorers: [
    {
      name: "Sentrix Scan Testnet",
      url: "https://scan-testnet.sentrixchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
