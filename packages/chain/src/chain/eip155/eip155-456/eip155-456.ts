import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_456: Chain = {
  name: "ARZIO Chain",
  shortName: "arzio",
  chain: "ARZIO",
  icon: "arzio",
  rpc: [
    "https://chain-rpc.arzio.co",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ARZIO",
    symbol: "AZO",
    decimals: 18,
  },
  infoURL: "https://chain.arzio.co",
  chainId: 456,
  networkId: 456,
  explorers: [
    {
      name: "ARZIO Scan",
      url: "https://scan.arzio.co",
      standard: "EIP3091",
    },
  ],
}
