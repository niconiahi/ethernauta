## Philosophy

This module allows you to sign any transaction. It will return the hashed transaction. This hash can then be submitted to the blockchain. The idea here is that the wallet is only in charge of signing. Execution is delegated, as per design, effectively making it a more generic layer than other alternatives

## Modules

- [chain](https://github.com/niconiahi/ethernauta/blob/main/packages/chain/README.md)
- [eth](https://github.com/niconiahi/ethernauta/blob/main/packages/eth/README.md)
- [transaction](https://github.com/niconiahi/ethernauta/blob/main/packages/transaction/README.md)
- [transport](https://github.com/niconiahi/ethernauta/blob/main/packages/transport/README.md)
- [wallet](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/README.md)


### Files to pay attention

- [utils/rlp.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/utils/rlp.ts)
- [utils/event.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/utils/event.ts)
- [utils/vault.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/utils/vault.ts)
- [utils/crypto.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/utils/crypto.ts)
- [utils/sign-transaction.ts](https://github.com/niconiahi/ethernauta/blob/main/packages/wallet/utils/sign-transaction.ts)
