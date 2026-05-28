import type { Chain } from "../shared"

export const eip155_7001 = {
  name: "ZetaChain Testnet",
  shortName: "zetachain-testnet",
  chain: "ZetaChain",
  icon: "zetachain",
  rpc: [
    "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
    "https://zetachain-testnet.public.blastapi.io",
    "https://zetachain-athens.g.allthatnode.com/archive/evm",
    "https://7001.rpc.thirdweb.com",
    "https://zeta-chain-testnet.drpc.org",
  ],
  faucets: ["https://zetachain.com/docs/reference/faucet"],
  nativeCurrency: {
    name: "Zeta",
    symbol: "ZETA",
    decimals: 18,
  },
  infoURL: "https://zetachain.com/docs",
  chainId: 7001,
  networkId: 7001,
  slip44: 1,
  explorers: [
    {
      name: "ZetaScan",
      url: "https://testnet.zetascan.com",
      standard: "none",
    },
  ],
  status: "active",
} satisfies Chain
