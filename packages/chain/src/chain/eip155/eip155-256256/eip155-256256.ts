import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_256256: Chain = {
  name: "CMP-Mainnet",
  shortName: "cmp-mainnet",
  chain: "CMP",
  rpc: [
    "https://mainnet.block.caduceus.foundation",
    "wss://mainnet.block.caduceus.foundation",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Caduceus Token",
    symbol: "CMP",
    decimals: 18,
  },
  infoURL: "https://caduceus.foundation/",
  chainId: 256256,
  networkId: 256256,
  explorers: [
    {
      name: "Mainnet Scan",
      url: "https://mainnet.scan.caduceus.foundation",
      standard: "none",
    },
  ],
}
