import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_4096: Chain = {
  name: "Bitindi Testnet",
  shortName: "BNIt",
  chain: "BNI",
  icon: "bitindiTestnet",
  rpc: [
    "https://testnet-rpc.bitindi.org",
  ],
  faucets: [
    "https://faucet.bitindi.org",
  ],
  nativeCurrency: {
    name: "BNI",
    symbol: "$BNI",
    decimals: 18,
  },
  infoURL: "https://bitindi.org",
  chainId: 4096,
  networkId: 4096,
  explorers: [
    {
      name: "Bitindi",
      url: "https://testnet.bitindiscan.com",
      standard: "EIP3091",
    },
  ],
}
