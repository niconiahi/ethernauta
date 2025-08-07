// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_114 = {
  name: "Flare Testnet Coston2",
  shortName: "c2flr",
  chain: "FLR",
  icon: "coston2",
  rpc: [
    "https://coston2-api.flare.network/ext/C/rpc",
    "https://flare-testnet-coston2.rpc.thirdweb.com",
    "https://flaretestnet-bundler.etherspot.io",
    "https://01-gravelines-005-01.rpc.tatum.io/ext/bc/C/rpc",
    "https://02-chicago-005-02.rpc.tatum.io/ext/bc/C/rpc",
    "https://02-tokyo-005-03.rpc.tatum.io/ext/bc/C/rpc",
    "https://coston2.enosys.global/ext/C/rpc",
  ],
  faucets: ["https://faucet.flare.network"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Coston2 Flare",
    symbol: "C2FLR",
    decimals: 18,
  },
  infoURL: "https://flare.network",
  chainId: 114,
  networkId: 114,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://coston2-explorer.flare.network",
      standard: "EIP3091",
    },
    {
      name: "Routescan",
      url: "https://coston2.testnet.flarescan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
