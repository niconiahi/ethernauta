import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_126: Chain = {
  name: "OYchain Mainnet",
  shortName: "OYchainMainnet",
  chain: "OYchain",
  icon: "oychain",
  rpc: [
    "https://rpc.mainnet.oychain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OYchain Token",
    symbol: "OY",
    decimals: 18,
  },
  infoURL: "https://www.oychain.io",
  chainId: 126,
  networkId: 126,
  slip44: 126,
  explorers: [
    {
      name: "OYchain Mainnet Explorer",
      url: "https://explorer.oychain.io",
      standard: "none",
    },
  ],
}
