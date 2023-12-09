/* eslint no-template-curly-in-string: 0 */
export const tbitrock = {
  name: "Bitrock Testnet",
  shortName: "tbitrock",
  chain: "Bitrock",
  icon: "bitrock",
  rpc: [
    "https://testnet.bit-rock.io",
  ],
  faucets: [
    "https://faucet.bit-rock.io",
  ],
  nativeCurrency: {
    name: "BITROCK",
    symbol: "BROCK",
    decimals: 18,
  },
  infoURL: "https://bit-rock.io",
  chainId: 7771,
  networkId: 7771,
  explorers: [
    {
      name: "Bitrock Testnet Explorer",
      url: "https://testnetscan.bit-rock.io",
      standard: "EIP3091",
    },
  ],
} as const
