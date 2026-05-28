import type { Chain } from "../shared"

export const eip155_20011 = {
  name: "Mandala Chain Testnet",
  shortName: "mandala-testnet",
  chain: "MANDALA",
  icon: "mandala",
  rpc: ["https://rpc1-testnet.mandalachain.io"],
  faucets: ["https://dripper.mandalachain.io"],
  nativeCurrency: {
    name: "Kepeng Test",
    symbol: "KPGT",
    decimals: 18,
  },
  infoURL: "https://mandalachain.io",
  chainId: 20011,
  networkId: 20011,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.testnet.mandalachain.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://portal.arbitrum.io/bridge?destinationChain=mandala-chain-testnet&sanitized=true&sourceChain=sepolia",
      },
    ],
  },
  status: "active",
} satisfies Chain
