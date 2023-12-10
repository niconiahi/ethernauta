import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_9996: Chain = {
  name: "Mind Smart Chain Mainnet",
  shortName: "MIND",
  chain: "MIND",
  icon: "mindchain",
  rpc: [
    "https://rpc-msc.mindchain.info/",
    "https://seednode.mindchain.info",
    "https://archive.mindchain.info/",
    "wss://archive.mindchain.info/ws",
    "wss://seednode.mindchain.info/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MIND Coin",
    symbol: "MIND",
    decimals: 18,
  },
  infoURL: "https://mindchain.info",
  chainId: 9996,
  networkId: 9996,
  explorers: [
    {
      name: "Mind Chain explorer",
      url: "https://mainnet.mindscan.info",
      standard: "EIP3091",
    },
  ],
}
