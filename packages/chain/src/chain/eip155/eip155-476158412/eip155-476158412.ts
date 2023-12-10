import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_476158412: Chain = {
  name: "SKALE Europa Hub Testnet",
  shortName: "europa-testnet",
  title: "Europa Hub Testnet",
  chain: "staging-legal-crazy-castor",
  icon: "europa",
  rpc: [
    "https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor",
  ],
  faucets: [
    "https://sfuel.dirtroad.dev/staging",
  ],
  nativeCurrency: {
    name: "sFUEL",
    symbol: "sFUEL",
    decimals: 18,
  },
  infoURL: "https://europahub.network/",
  chainId: 476158412,
  networkId: 476158412,
  explorers: [
    {
      name: "Blockscout",
      url: "https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com",
      standard: "EIP3091",
    },
  ],
}
