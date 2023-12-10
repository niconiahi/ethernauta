import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_84532: Chain = {
  name: "Base Sepolia Testnet",
  shortName: "basesep",
  chain: "ETH",
  icon: "baseTestnet",
  rpc: [
    "https://sepolia.base.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://base.org",
  chainId: 84532,
  networkId: 84532,
  explorers: [
    {
      name: "basescout",
      url: "https://base-sepolia.blockscout.com",
      standard: "EIP3091",
    },
  ],
}
