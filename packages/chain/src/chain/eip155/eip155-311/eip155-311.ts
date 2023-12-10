import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_311: Chain = {
  name: "Omax Mainnet",
  shortName: "omax",
  chain: "OMAX Chain",
  icon: "omaxchain",
  rpc: [
    "https://mainapi.omaxray.com",
  ],
  faucets: [
    "https://faucet.omaxray.com/",
  ],
  nativeCurrency: {
    name: "OMAX COIN",
    symbol: "OMAX",
    decimals: 18,
  },
  infoURL: "https://www.omaxcoin.com/",
  chainId: 311,
  networkId: 311,
  explorers: [
    {
      name: "Omax Chain Explorer",
      url: "https://omaxray.com",
      standard: "EIP3091",
    },
  ],
}
