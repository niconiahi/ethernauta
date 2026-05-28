import type { Chain } from "../shared"

export const eip155_324705682 = {
  name: "SKALE Base Sepolia",
  shortName: "skale-base-sepolia",
  chain: "skale-base-sepolia",
  icon: "skale",
  rpc: [
    "https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha",
    "wss://base-sepolia-testnet.skalenodes.com/v1/ws/jubilant-horrible-ancha",
  ],
  faucets: ["http://base-sepolia-faucet.skale.space"],
  nativeCurrency: {
    name: "Credits",
    symbol: "CREDIT",
    decimals: 18,
  },
  infoURL: "https://docs.skale.space/welcome/skale-on-base",
  chainId: 324705682,
  networkId: 324705682,
  explorers: [
    {
      name: "Blockscout",
      url: "https://base-sepolia-testnet-explorer.skalenodes.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
