import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_432201: Chain = {
  name: "Dexalot Subnet Testnet",
  shortName: "dexalot-testnet",
  chain: "DEXALOT",
  icon: "dexalot",
  rpc: [
    "https://subnets.avax.network/dexalot/testnet/rpc",
  ],
  faucets: [
    "https://faucet.avax.network/?subnet=dexalot",
  ],
  nativeCurrency: {
    name: "Dexalot",
    symbol: "ALOT",
    decimals: 18,
  },
  infoURL: "https://dexalot.com",
  chainId: 432201,
  networkId: 432201,
  explorers: [
    {
      name: "Avalanche Subnet Testnet Explorer",
      url: "https://subnets-test.avax.network/dexalot",
      standard: "EIP3091",
    },
  ],
}
