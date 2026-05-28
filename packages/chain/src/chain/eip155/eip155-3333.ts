import type { Chain } from "../shared"

export const eip155_3333 = {
  name: "EthStorage Testnet",
  shortName: "es-t",
  chain: "EthStorage",
  rpc: ["https://rpc.testnet.ethstorage.io:9546"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethstorage.io/",
  chainId: 3333,
  networkId: 3333,
  slip44: 1,
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
} satisfies Chain
