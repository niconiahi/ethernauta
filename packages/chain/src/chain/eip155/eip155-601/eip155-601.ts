/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_601 = {
  name: "PEER Testnet",
  shortName: "PEER",
  chain: "PEER",
  icon: "peer",
  rpc: [
    "http://testnet-polka-host-232813573.us-west-1.elb.amazonaws.com",
  ],
  faucets: [
    "https://testnet.peer.inc",
  ],
  nativeCurrency: {
    name: "PEER Token",
    symbol: "PEER",
    decimals: 18,
  },
  infoURL: "https://peer.inc",
  chainId: 601,
  networkId: 601,
  explorers: [
    {
      name: "PEER Explorer",
      url: "https://testnet.peer.inc",
      standard: "none",
    },
  ],
} satisfies Chain
