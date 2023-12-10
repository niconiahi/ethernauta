import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2199: Chain = {
  name: "Moonsama Network",
  shortName: "msn",
  chain: "MSN",
  icon: "msn",
  rpc: [
    "https://rpc.moonsama.com",
    "wss://rpc.moonsama.com/ws",
  ],
  faucets: [
    "https://multiverse.moonsama.com/faucet",
  ],
  nativeCurrency: {
    name: "Sama Token",
    symbol: "SAMA",
    decimals: 18,
  },
  infoURL: "https://moonsama.com",
  chainId: 2199,
  networkId: 2199,
  slip44: 2199,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.moonsama.com",
      standard: "EIP3091",
    },
  ],
}
