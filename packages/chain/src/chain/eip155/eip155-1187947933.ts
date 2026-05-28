import type { Chain } from "../shared"

export const eip155_1187947933 = {
  name: "SKALE Base",
  shortName: "skale-base",
  chain: "skale-base",
  rpc: [
    "https://skale-base.skalenodes.com/v1/base",
    "wss://skale-base.skalenodes.com/v1/ws/base",
  ],
  faucets: ["http://base-sepolia-faucet.skale.space"],
  nativeCurrency: {
    name: "Credits",
    symbol: "CREDIT",
    decimals: 18,
  },
  infoURL: "https://docs.skale.space/welcome/skale-on-base",
  chainId: 1187947933,
  networkId: 1187947933,
  explorers: [
    {
      name: "Blockscout",
      url: "https://skale-base-explorer.skalenodes.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
