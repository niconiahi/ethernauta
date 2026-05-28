import type { Chain } from "../shared"

export const eip155_262144 = {
  name: "MPCQ Mainnet",
  shortName: "mpcq",
  chain: "MPCQ",
  rpc: ["https://rpc.moneypoolscash.com"],
  faucets: [],
  nativeCurrency: {
    name: "MPCQ",
    symbol: "MPCQ",
    decimals: 18,
  },
  infoURL: "https://moneypoolscash.com",
  chainId: 262144,
  networkId: 262144,
} satisfies Chain
